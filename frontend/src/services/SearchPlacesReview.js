import axios from "axios";

const SERPAPI_KEY = "NFAD8KepttSR8xj1oWWcsZF4"; // ใส่ API Key ใหม่ที่คุณต้องการใช้

// ฟังก์ชันค้นหาร้านค้าและดึงรีวิว
export const searchPlacesWithReviews = async (apiKey) => {
  try {
    const keywords = ["ร้านอาหาร", "คาเฟ่", "ร้านกาแฟ", "ร้านเบเกอรี่"];
    const results = await Promise.all(
      keywords.map(async (keyword) => {
        const response = await axios.get("https://www.searchapi.io/api/v1/search", {
          params: {
            engine: "google_maps",
            q: keyword,
            location: "ประเทศไทย",
            hl: "th",
            api_key: apiKey,
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
      (place) => place?.address && regexThai.test(place.address)
    );

    console.log("ร้านค้าที่ผ่านการกรอง:", filteredResults);

    const placesWithDetails = await Promise.all(
      filteredResults.map(async (place) => {
        try {
          const details = await getPlaceDetails(place.place_id);
          return {
            place_id: place.place_id,
            title: place.title,
            address: place.address,
            category: place.type || "ไม่ระบุ",
            thumbnail: place.thumbnail || null,
            rating: place.rating || 0,
            review_count: place.user_rating_count || 0,
            opening_hours: details.opening_hours,
            phone_number: details.phone_number,
            reviews: details.reviews || [],
          };
        } catch (error) {
          console.error(`ไม่สามารถดึงข้อมูลเพิ่มเติมสำหรับ ${place.title}`, error);
          return {};
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

// ฟังก์ชันดึงรายละเอียดร้านค้า
export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get("https://www.searchapi.io/api/v1/search", {
      params: {
        engine: "google_maps_reviews",
        place_id: placeId,
        api_key: SERPAPI_KEY,
      },
    });

    const placeData = response.data;
    console.log("ข้อมูลรีวิวที่ดึงมา:", placeData.reviews);

    const openingHours = placeData.open_hours
      ? Object.entries(placeData.open_hours)
          .map(([day, hours]) => `${day}: ${hours}`)
          .join('\n')
      : placeData.hours?.status || placeData.open_state || "ไม่ระบุ";

    const phoneNumber = placeData.phone || placeData.phone_number || placeData.contact || placeData.formatted_phone_number || "ไม่ระบุ";

    return {
      title: placeData.title || "ไม่ระบุชื่อร้าน",
      thumbnail: placeData.thumbnail || null,
      rating: placeData.rating || 0,
      address: placeData.address || "ไม่ระบุ",
      opening_hours: openingHours,
      phone_number: phoneNumber,
      reviews: Array.isArray(placeData.reviews) ? placeData.reviews.map(review => {
        console.log("ข้อมูลรีวิว:", review);
        return {
          source: review.author_name || review.name || "ไม่ระบุ", 
          rating: review.rating || 0,
          snippet: review.text || "ไม่มีข้อความ",
        }
      }) : [], 
    };
  } catch (error) {
    console.error("Error fetching place details:", error.message);
    return {
      opening_hours: "ไม่ระบุ",
      phone_number: "ไม่ระบุ",
      reviews: [],
    };
  }
};
