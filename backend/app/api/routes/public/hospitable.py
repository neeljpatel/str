from fastapi import APIRouter, HTTPException
import httpx
from app.core.config import settings

router = APIRouter()

HOSPITABLE_BASE_URL = "https://public.api.hospitable.com/v2"

async def get_hospitable_headers():
    if not settings.HOSPITABLE_ACCESS_TOKEN:
        raise HTTPException(status_code=500, detail="Hospitable access token not configured")
    return {
        "Authorization": f"Bearer {settings.HOSPITABLE_ACCESS_TOKEN}",
        "Accept": "application/json"
    }

@router.get("/reviews/total")
async def get_total_reviews():
    """
    Fetch all properties and calculate total reviews.
    """
    headers = await get_hospitable_headers()
    
    async with httpx.AsyncClient() as client:
        try:
            # Get properties
            prop_res = await client.get(f"{HOSPITABLE_BASE_URL}/properties", headers=headers)
            prop_res.raise_for_status()
            properties = prop_res.json().get("data", [])
            
            total_reviews = 0
            # Get reviews for each property
            for prop in properties:
                prop_id = prop.get("id")
                if prop_id:
                    rev_res = await client.get(
                        f"{HOSPITABLE_BASE_URL}/properties/{prop_id}/reviews", 
                        headers=headers
                    )
                    if rev_res.status_code == 200:
                        rev_data = rev_res.json()
                        total_reviews += rev_data.get("meta", {}).get("total", 0)
                        
            return {"total_reviews": total_reviews}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Failed to fetch total reviews from Hospitable: {str(e)}")

@router.get("/properties/{uuid}/images")
async def get_property_images(uuid: str):
    """
    Fetch images for a specific property.
    """
    headers = await get_hospitable_headers()
    
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(f"{HOSPITABLE_BASE_URL}/properties/{uuid}/images", headers=headers)
            res.raise_for_status()
            data = res.json().get("data", [])
            images = [img.get("url") for img in data if img.get("url")]
            return {"images": images}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Failed to fetch images from Hospitable: {str(e)}")

@router.get("/properties/{uuid}/reviews")
async def get_property_reviews(uuid: str):
    """
    Fetch the 5 most recent 5-star reviews for a specific property.
    Returns normalized review objects with guest name and stay date.
    """
    headers = await get_hospitable_headers()
    
    async with httpx.AsyncClient() as client:
        try:
            # Reviews are returned newest-first by default. Fetch enough to find 5 five-star reviews.
            res = await client.get(
                f"{HOSPITABLE_BASE_URL}/properties/{uuid}/reviews",
                params={"per_page": 20, "include": "guest,reservation"},
                headers=headers
            )
            res.raise_for_status()
            data = res.json().get("data", [])
            
            five_star_reviews = []
            for r in data:
                rating = r.get("public", {}).get("rating")
                review_text = r.get("public", {}).get("review", "")
                if rating != 5 or not review_text:
                    continue
                
                # Only include reviews with at least 25 words
                if len(review_text.split()) < 25:
                    continue
                
                guest = r.get("guest", {}) or {}
                reservation = r.get("reservation", {}) or {}
                reviewed_at = r.get("reviewed_at", "")
                
                # Use check_in date for "month/year of stay", fallback to reviewed_at
                stay_date = reservation.get("check_in") or reviewed_at
                
                five_star_reviews.append({
                    "id": r.get("id"),
                    "review": review_text,
                    "rating": rating,
                    "guest_first_name": guest.get("first_name", "Guest"),
                    "stay_date": stay_date,
                    "reviewed_at": reviewed_at,
                })
                
                if len(five_star_reviews) >= 5:
                    break
            
            return {"reviews": five_star_reviews}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Failed to fetch reviews from Hospitable: {str(e)}")
