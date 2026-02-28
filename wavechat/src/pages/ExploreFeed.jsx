import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiHeart3Line, RiHeart3Fill, RiShareForwardLine, RiPlayFill, RiPauseFill } from "react-icons/ri";
import { FiRefreshCw } from "react-icons/fi";
import { fetchExploreFeed } from "../api/services/userServices";
import PageLoader from "../components/PageLoader";

const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

// Video card component
const VideoCard = ({ src, thumbnail, onPlay }) => {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const toggle = () => {
        if (!videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(() => { });
        }
        setPlaying(!playing);
    };

    return (
        <div className="relative rounded-xl overflow-hidden bg-black cursor-pointer group" onClick={toggle}>
            {!loaded && thumbnail && (
                <img src={thumbnail} alt="" className="w-full max-h-80 object-cover" />
            )}
            <video
                ref={videoRef}
                src={src}
                poster={thumbnail}
                className={`w-full max-h-80 object-cover ${loaded ? "" : "hidden"}`}
                onLoadedData={() => setLoaded(true)}
                loop
                muted
                playsInline
            />
            {/* Play/pause overlay */}
            <AnimatePresence>
                {!playing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20"
                    >
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <RiPlayFill size={24} className="text-gray-800 ml-1" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ExploreFeed = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasNext, setHasNext] = useState(true);
    const [error, setError] = useState(null);
    const observerRef = useRef(null);

    const loadFeed = useCallback(async (pageNum, append = false) => {
        try {
            setError(null);
            if (append) setLoadingMore(true);
            else setLoading(true);

            const res = await fetchExploreFeed(pageNum, 10);
            const data = res.data;

            if (append) {
                setItems((prev) => [...prev, ...data.results]);
            } else {
                setItems(data.results);
            }
            setHasNext(data.has_next);
        } catch (err) {
            setError("Failed to load explore feed");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        loadFeed(1);
    }, [loadFeed]);

    // Infinite scroll with IntersectionObserver
    const lastItemRef = useCallback(
        (node) => {
            if (loadingMore) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNext) {
                    setPage((p) => {
                        const nextPage = p + 1;
                        loadFeed(nextPage, true);
                        return nextPage;
                    });
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [loadingMore, hasNext, loadFeed]
    );

    // Toggle like (local only for explore)
    const handleLike = (itemId) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id !== itemId) return item;
                return {
                    ...item,
                    is_liked: !item.is_liked,
                    like_count: item.is_liked ? item.like_count - 1 : item.like_count + 1,
                };
            })
        );
    };

    const handleShare = (item) => {
        if (navigator.share) {
            navigator.share({
                title: `${item.author.name} on WaveChat`,
                text: item.content,
                url: item.pexels_url || window.location.href,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(item.pexels_url || item.content);
        }
    };

    // Loading
    if (loading && items.length === 0) {
        return <PageLoader message="Discovering amazing content..." />;
    }

    // Error
    if (error && items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <span className="text-3xl">⚠️</span>
                <p className="text-gray-600 font-medium">{error}</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => loadFeed(1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium"
                >
                    <FiRefreshCw size={14} />
                    Try Again
                </motion.button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 py-4">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🌍</span>
                        <h1 className="text-xl font-bold text-gray-800">Explore</h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setPage(1); loadFeed(1); }}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-purple-600"
                    >
                        <FiRefreshCw size={16} />
                    </motion.button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
                {items.map((item, index) => (
                    <motion.div
                        key={`${item.id}_${index}`}
                        ref={index === items.length - 1 ? lastItemRef : null}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        {/* Author header */}
                        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center font-bold text-sm">
                                {item.author.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">{item.author.name}</p>
                                <p className="text-[11px] text-gray-400">
                                    {item.type === "video" ? "🎬 Video" : "📸 Photo"} • via Pexels
                                </p>
                            </div>
                        </div>

                        {/* Caption */}
                        <p className="px-4 py-2 text-gray-700 text-[14.5px] leading-relaxed">
                            {item.content}
                        </p>

                        {/* Media */}
                        <div className="px-4 pb-2">
                            {item.media.type === "video" ? (
                                <VideoCard
                                    src={item.media.url}
                                    thumbnail={item.media.thumbnail}
                                />
                            ) : (
                                <img
                                    src={item.media.url}
                                    alt={item.media.alt || ""}
                                    className="w-full rounded-xl object-cover max-h-96"
                                    loading="lazy"
                                />
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 px-3 py-2 border-t border-gray-50">
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleLike(item.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition ${item.is_liked
                                        ? "text-red-500 bg-red-50"
                                        : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {item.is_liked ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    >
                                        <RiHeart3Fill size={18} />
                                    </motion.div>
                                ) : (
                                    <RiHeart3Line size={18} />
                                )}
                                {item.like_count > 0 && item.like_count}
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleShare(item)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                            >
                                <RiShareForwardLine size={18} />
                                Share
                            </motion.button>
                        </div>
                    </motion.div>
                ))}

                {/* Loading more */}
                {loadingMore && (
                    <div className="flex justify-center py-6">
                        <div className="flex items-center gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2.5 h-2.5 rounded-full bg-purple-500"
                                    animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* End of feed */}
                {!hasNext && items.length > 0 && (
                    <p className="text-center text-gray-400 text-sm py-6">
                        You've seen it all! 🎉
                    </p>
                )}
            </div>
        </div>
    );
};

export default ExploreFeed;
