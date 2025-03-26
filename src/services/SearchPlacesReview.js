import axios from 'axios';

const SERPAPI_KEY = " "; 

// ฟังก์ชันค้นหาสถานที่
export const searchPlacesWithReviews = async () => {
  try {
    const keywords = [
      "ร้านอาหาร", "ร้านกาแฟ", "ร้านเบเกอรี่", "คาเฟ่", 
      "ร้านขนม", "ร้านอาหารญี่ปุ่น", "ร้านอาหารอิตาเลียน", 
      "ร้านชานม", "ร้านเบเกอรี่", "ร้านน้ำผลไม้", "ร้านพิซซ่า",
      "ร้านอาหารจีน", "ร้านอาหารเกาหลี", "ร้านสเต็ก", "ร้านบาร์บีคิว",
      "ร้านอาหารซีฟู้ด", "ร้านข้าวมันไก่", "ร้านก๋วยเตี๋ยว", "ร้านข้าวราดแกง", 
      "ร้านข้าวซอย", "ร้านบิงซู", "ร้านช็อกโกแลต", "ร้านกาแฟสด",
      "ร้านน้ำปั่น", "ร้านขนมหวาน", "ร้านค็อกเทล", "ร้านไวน์",
      "ร้านอาหารมังสวิรัติ", "ร้านอาหารอินเดีย", "ร้านอาหารเวียดนาม", "ร้านขนมปัง"
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
    // กรองที่มีภาษาไทยในที่อยู่
    const filteredResults = mergedResults.filter(place =>
      place.address && regexThai.test(place.address) // ตรวจสอบที่อยู่มีภาษาไทย
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
            reviews: reviews, // เพิ่มรีวิว
          };
        } catch (error) {
          console.error(`ไม่สามารถดึงรีวิวสำหรับสถานที่ ${place.title}`, error);
          return {
            place_id: place.place_id,
            title: place.title,
            address: place.address,
            thumbnail: place.thumbnail || null,
            reviews: [], // ถ้าไม่สามารถดึงรีวิวได้ ให้เป็นอาร์เรย์ว่าง
          };
        }
      })
    );

    // กรองสถานที่ที่มีรีวิว
    const placesWithReviewsAvailable = placesWithReviews.filter(place => place.reviews.length > 0);

    // ให้เลือกแค่ 2 สถานที่ที่มีรีวิวมากที่สุดจากแต่ละ keyword
    const placesByKeyword = keywords.map((keyword) => {
      const placesForKeyword = placesWithReviewsAvailable.filter(place => place.title.includes(keyword));

      // จัดเรียงตามจำนวนรีวิวจากมากไปหาน้อย
      const sortedPlaces = placesForKeyword.sort((a, b) => b.reviews.length - a.reviews.length);

      // เลือกแค่ 2 สถานที่แรกที่มีรีวิวเยอะที่สุด
      return sortedPlaces.slice(0, 2); 
    });

    // รวมสถานที่จากแต่ละ keyword
    const finalPlaces = placesByKeyword.flat();

    return finalPlaces;
    
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
