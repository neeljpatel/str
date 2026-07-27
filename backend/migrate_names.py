from supabase import create_client
from app.core.config import settings

def main():
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        print("Missing Supabase configuration.")
        return

    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    print("Migrating property names and slugs in Supabase...")

    # 1. Fetch existing gallery data
    g1 = supabase.table("galleries").select("*").eq("property_slug", "windy-city").execute()
    g2 = supabase.table("galleries").select("*").eq("property_slug", "navy-pier").execute()

    images_windy = g1.data[0]["images"] if g1.data else []
    images_navy = g2.data[0]["images"] if g2.data else []

    # 2. Delete gallery rows referencing old slugs to satisfy FK constraint
    if g1.data:
        supabase.table("galleries").delete().eq("property_slug", "windy-city").execute()
        print("Temporarily removed gallery row for windy-city")
    if g2.data:
        supabase.table("galleries").delete().eq("property_slug", "navy-pier").execute()
        print("Temporarily removed gallery row for navy-pier")

    # 3. Update Windy City Condo -> City Center Oasis Condo
    res1 = supabase.table("properties").update({
        "slug": "city-center-oasis",
        "title": "City Center Oasis Condo"
    }).eq("id", "b15ffd98-d93c-42bf-b0e4-1aa385963072").execute()
    print("Updated property id b15ffd98-d93c-42bf-b0e4-1aa385963072 -> City Center Oasis Condo")

    # 4. Update Navy Pier Condo -> Luxurious River North Condo
    res2 = supabase.table("properties").update({
        "slug": "luxurious-river-north",
        "title": "Luxurious River North Condo"
    }).eq("id", "5927e9de-4c31-469b-bf4f-2bd0bd2ef6f4").execute()
    print("Updated property id 5927e9de-4c31-469b-bf4f-2bd0bd2ef6f4 -> Luxurious River North Condo")

    # 5. Re-insert gallery rows with new slugs
    if images_windy or g1.data:
        supabase.table("galleries").upsert({
            "property_slug": "city-center-oasis",
            "images": images_windy
        }).execute()
        print("Re-inserted gallery for city-center-oasis")

    if images_navy or g2.data:
        supabase.table("galleries").upsert({
            "property_slug": "luxurious-river-north",
            "images": images_navy
        }).execute()
        print("Re-inserted gallery for luxurious-river-north")

    print("Migration completed successfully!")

if __name__ == "__main__":
    main()
