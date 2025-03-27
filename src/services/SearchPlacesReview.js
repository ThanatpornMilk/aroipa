import axios from "axios";

const SERPAPI_KEY = "b20b9f17a94954ba64083620986c3fb4341a70aee4a60911d9410161c8f8183d"; // ใส่ API Key ของคุณ

export const searchPlacesWithReviews = async () => {
  try {
    const keywords = ["ร้านอาหาร", "คาเฟ่", "ร้านกาแฟ", "ร้านเบเกอรี่"];
    const results = await Promise.all(
      keywords.map(async (keyword) => {
        const response = await axios.get("https://serpapi.com/search", {
          params: {
            engine: "google_maps",
            q: keyword,
            location: "ประเทศไทย",
            hl: "th",
            api_key: SERPAPI_KEY,
          },
        });
        console.log(`ผลลัพธ์สำหรับ ${keyword}:`, response.data.local_results);
        return response.data.local_results || [];
      })
    );

    const mergedResults = results.flat();
    console.log("ข้อมูลทั้งหมดที่ดึงมา:", mergedResults);

    const regexThai = /[\u0E00-\u0E7F]/;
    const filteredResults = mergedResults.filter(
      (place) => place?.address && regexThai.test(place.address) // ปรับเงื่อนไขกรองที่อยู่
    );

    console.log("ร้านค้าที่ผ่านการกรอง:", filteredResults);

    const placesWithDetails = await Promise.all(
      filteredResults.map(async (place) => {
        try {
          const details = await getPlaceDetails(place.place_id);
          if (!details) return {}; // เปลี่ยนจาก null เป็น {}

          return {
            place_id: place.place_id,
            title: place.title,
            address: place.address,
            category: place.type || "ไม่ระบุ",
            thumbnail: place.thumbnail || null,
            rating: place.rating || 0,
            review_count: place.user_rating_count || 0,
            opening_hours: details.opening_hours || "ไม่มีข้อมูล",
            phone_number: details.phone_number || "ไม่มีข้อมูล",
            reviews: details.reviews || [], // ปรับให้ไม่เป็น undefined
          };
        } catch (error) {
          console.error(`ไม่สามารถดึงข้อมูลเพิ่มเติมสำหรับ ${place.title}`, error);
          return {}; // ให้คืนข้อมูลว่างเมื่อมีข้อผิดพลาด
        }
      })
    );

    const finalResults = placesWithDetails.filter(place => Object.keys(place).length !== 0);
    console.log("ข้อมูลสุดท้ายที่ส่งไปแสดง:", finalResults);

    return finalResults;
  } catch (error) {
    console.error("Error fetching places:", error.response?.data || error.message);
    return [];
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_maps_reviews",
        place_id: placeId,
        api_key: SERPAPI_KEY,
      },
    });

    const placeData = response.data;
    return {
      title: placeData.title || "ไม่ระบุชื่อร้าน",
      thumbnail: placeData.thumbnail || null,
      rating: placeData.rating || 0,
      review_count: placeData.user_rating_count || 0,
      address: placeData.address || "ไม่มีข้อมูล",
      opening_hours: placeData.opening_hours?.hours || "ไม่มีข้อมูล",
      phone_number: placeData.primary_phone || "ไม่มีข้อมูล",
      reviews: (placeData.reviews || []).map((review) => ({
        source: review.author_name,
        rating: review.rating,
        snippet: review.text,
        date: review.date || "ไม่ระบุ",
      })),
    };
  } catch (error) {
    console.error("Error fetching place details:", error.message);
    return { opening_hours: "ไม่มีข้อมูล", phone_number: "ไม่มีข้อมูล", reviews: [] };
  }
};
