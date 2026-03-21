import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReelFeed from '../components/ReelFeed'
import { serverUrl } from '../App'

const Saved = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        axios.get(`${serverUrl}/api/user/saved-food`, { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.item._id,
                    video: item.item.video,
                    description: item.item.description,
                    likeCount: item.item.likeCount,
                    saveCount: item.item.saveCount,
                    commentCount: item.item.commentCount,
                    foodPartner: item.item.owner,
                }))
                setVideos(savedFoods)
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            await axios.post(`${serverUrl}/api/user/save`, { itemId: item._id }, { withCredentials: true })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, saveCount: Math.max(0, (v.saveCount ?? 1) - 1) } : v))
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
            navigateto="/reels"
        />
    )
}

export default Saved