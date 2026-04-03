import json
from supabase import create_client
from app.core.config import settings

def main():
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        print("Missing Supabase configuration.")
        return

    supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    properties = [
        {
            "id": "b15ffd98-d93c-42bf-b0e4-1aa385963072",
            "slug": "windy-city",
            "title": "Windy City Condo",
            "location": "Chicago, IL",
            "summary": "Welcome to your ideal Chicago home - a spacious, modern 3-bedroom condo in the heart of River North, one of the city’s most walkable neighborhoods.",
            "checkin": "4:00 PM",
            "checkout": "11:00 AM",
            "iframe_src": "https://booking.hospitable.com/widget/a0fe1907-fc70-4a21-8fab-d7cf87eca1c0/637726",
            "overview": "Guests consistently tell us the condo feels much larger than the photos. Planning a friends celebration, family getaway, work trip? You’ll be steps from Chicago’s best dining, shopping, and nightlife, with a quiet, comfortable place to unwind at the end of the day.",
            "capacity": {"guests": 10, "bedrooms": 3, "bathrooms": 2},
            "space_overview": [
                "Fully stocked kitchen with new appliances, coffee machine, and everything needed for home-cooked meals",
                "Game room with board games, poker chips, and a shuffleboard table",
                "Local Chicago artwork showcasing iconic landmarks and neighborhood scenes",
                "High-speed 250 Mbps Wi-Fi",
                "Attached, gated parking for 2 vehicles",
                "Private, oversized patio with a Weber grill - perfect for outdoor dining",
                "Keyless entry for easy, secure self check-in"
            ],
            "amenities": ["Air Conditioning", "High-Speed Wi-Fi", "Fully Equipped Kitchen", "2 Parking Spots", "Private Patio", "BBQ Grill", "Washer & Dryer"],
            "rooms": [
                {"name": "Primary Bedroom", "description": "1 King Bed"},
                {"name": "Bedroom 2", "description": "2 Queen Beds"},
                {"name": "Bedroom 3", "description": "2 Queen Beds"},
                {"name": "Living Room", "description": "1 Couch Bed"}
            ],
            "rules": [
                "Smoking is not allowed inside the home or the balcony.",
                "No large gatherings or loud music allowed. Maximum number of people in the home/balcony is 10.",
                "Building quiet hours are 10 PM to 7 AM.",
                "No pets allowed inside the home."
            ]
        },
        {
            "id": "5927e9de-4c31-469b-bf4f-2bd0bd2ef6f4",
            "slug": "navy-pier",
            "title": "Navy Pier Condo",
            "location": "Chicago, IL",
            "summary": "Discover a stylish retreat designed for comfort, entertainment, and unbeatable walkability.",
            "checkin": "4:00 PM",
            "checkout": "11:00 AM",
            "iframe_src": "https://booking.hospitable.com/widget/a0fe1907-fc70-4a21-8fab-d7cf87eca1c0/637728",
            "overview": "River North is Chicago’s most fashionable and trendsetting neighborhood. Historic architecture is beautifully melded with modern design and amenities. It’s only steps away to the city’s premiere shopping along Michigan Avenue, tons of restaurants to fit any taste, and in the middle of the nightlife scene.",
            "capacity": {"guests": 10, "bedrooms": 3, "bathrooms": 2},
            "space_overview": [
                "Fully stocked kitchen with new appliances",
                "Dedicated game room with a foosball table",
                "High-speed Wi-Fi throughout",
                "Attached, gated parking for one vehicle",
                "Private, spacious patio with a Weber grill",
                "Keyless entry for easy, secure self check-in"
            ],
            "amenities": ["Air Conditioning", "High-Speed Wi-Fi", "Fully Equipped Kitchen", "1 Parking Spot", "Private Patio", "BBQ Grill", "Washer & Dryer"],
            "rooms": [
                {"name": "Primary Bedroom", "description": "1 King Bed"},
                {"name": "Bedroom 2", "description": "2 Queen Beds"},
                {"name": "Bedroom 3", "description": "2 Queen Beds"}
            ],
            "rules": [
                "Smoking is not allowed inside the home or the balcony.",
                "No large gatherings or loud music allowed. Maximum number of people in the home/balcony is 12.",
                "Building quiet hours are 10 PM to 7 AM.",
                "No pets allowed inside the home."
            ]
        }
    ]

    for prop in properties:
        res = supabase.table("properties").upsert(prop).execute()
        print(f"Inserted property {prop['slug']}")

    with open("../chicago-collective/data/gallery.json", "r") as f:
        galleries = json.load(f)

    for slug, images in galleries.items():
        doc = {"property_slug": slug, "images": images}
        supabase.table("galleries").upsert(doc).execute()
        print(f"Inserted gallery for {slug}")

if __name__ == "__main__":
    main()
