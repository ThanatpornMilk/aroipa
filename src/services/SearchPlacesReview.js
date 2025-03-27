import axios from 'axios';

const SERPAPI_KEY = " "; 

// ฟังก์ชันค้นหาสถานที่
export const searchPlacesWithReviews = async () => {
  try {
    const keywords = [
      "ร้านอาหาร", "ร้านกาแฟ", "ร้านเบเกอรี่", "คาเฟ่", 
    ];    

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
        return response.data.local_results || [];
      })
    );

    // รวมผลลัพธ์ทั้งหมดจากทุก keyword
    const mergedResults = results.flat();

    // ใช้ Regular Expression เพื่อตรวจสอบว่ามีภาษาไทยในที่อยู่หรือไม่
    const regexThai = /[\u0E00-\u0E7F]/;  
    // กรองเฉพาะสถานที่ที่มีที่อยู่เป็นภาษาไทย
    const filteredResults = mergedResults.filter(place =>
      place.address && regexThai.test(place.address) 
    );

    // สำหรับแต่ละสถานที่ ดึงรีวิวมาด้วย
    const placesWithReviews = await Promise.all(
      filteredResults.map(async (place) => {
        try {
          const reviews = await getPlaceReviews(place.place_id);
          return {
            place_id: place.place_id,
            title: place.title,
            address: place.address,
            thumbnail: place.thumbnail || null,
            reviews: reviews, 
          };
        } catch (error) {
          console.error(`ไม่สามารถดึงรีวิวสำหรับสถานที่ ${place.title}`, error);
          return {
            place_id: place.place_id,
            title: place.title,
            address: place.address,
            thumbnail: place.thumbnail || null,
            reviews: [], 
          };
        }
      })
    );

    // กรองเฉพาะสถานที่ที่มีรีวิว
    const placesWithReviewsAvailable = placesWithReviews.filter(place => place.reviews.length > 0);

    return placesWithReviewsAvailable;
    
  } catch (error) {
    console.error("Error fetching places:", error.response?.data || error.message);
    return [];
  }
};

// ฟังก์ชันดึงรีวิวจากสถานที่
export const getPlaceReviews = async (placeId) => {
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        engine: "google_maps",
        q: placeId,
        location: "ประเทศไทย",
        hl: "th",
        api_key: SERPAPI_KEY,
      },
    });

    // ตรวจสอบผลลัพธ์จาก API และดึงรีวิว
    const reviews = response.data.reviews || [];
    return reviews.map((review) => ({
      source: review.author_name,
      snippet: review.text,
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    throw new Error("ไม่สามารถดึงรีวิวได้");
  }
};
