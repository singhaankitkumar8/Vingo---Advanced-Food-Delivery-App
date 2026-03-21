import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsOfCity } from '../redux/userSlice'

function useItemsByCity() {
  const dispatch = useDispatch()
  const { city, userData } = useSelector(state => state.user)
  useEffect(() => {
    if (userData?.role === "user") {
        if (city && city !== "null" && city !== "undefined" && city.trim() !== "") {
          const fetchItems = async () => {
            try {
              const result = await axios.get(`${serverUrl}/api/item/getitemsbycity/${city}`, { withCredentials: true });
              dispatch(setItemsOfCity(result.data));
              console.log(result.data);
            } catch (error) {
              console.error("Error fetching items by city:", error);
            }
          };
          fetchItems();
        }
    }
  }, [city, userData, dispatch])
}

export default useItemsByCity

