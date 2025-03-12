import React, { useState, useEffect, useRef } from "react";
import Object from "../Blocks/Object/Object";
import CircularProgress from "@mui/material/CircularProgress"; // Лоадер от Material UI

const LazyLoadTours = ({ foundData, itemsPerPage = 3, handleOpen, isSimillar, open, setCartCount, pageName, titleObject, inCart }) => {
    const [visibleTours, setVisibleTours] = useState(foundData.slice(0, itemsPerPage)); // Первые N туров
    const [loadIndex, setLoadIndex] = useState(itemsPerPage); // Индекс загрузки
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    const observerRef = useRef(null);

    useEffect(() => {
        if (loadIndex >= foundData.length) return; // Если загружены все туры, отключаем наблюдатель

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    setIsLoading(true); // Показываем лоадер
                    setTimeout(() => {
                        setVisibleTours((prev) => [
                            ...prev,
                            ...foundData.slice(loadIndex, loadIndex + itemsPerPage),
                        ]);
                        setLoadIndex((prev) => prev + itemsPerPage);
                        setIsLoading(false); // Скрываем лоадер после загрузки
                    }, 1000);
                }
            },
            { threshold: 1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [visibleTours, foundData, isLoading]);

    // Если список найденных туров обновился, сбрасываем подгруженные данные
    useEffect(() => {
        setVisibleTours(foundData.slice(0, itemsPerPage));
        setLoadIndex(itemsPerPage);
    }, [foundData]);

    return (
        <>
            {visibleTours.map((tour, index) => (
                <Object 
                    key={index} 
                    handleOpen={handleOpen} 
                    isSimillar={isSimillar} 
                    open={open} 
                    setCartCount={setCartCount} 
                    regionData={tour} 
                    pageName={pageName} 
                    titleObject={titleObject} 
                    inCart={inCart} 
                />
            ))}
            {/* Лоадер */}
            {isLoading && (
                <div style={{ display: "flex", justifyContent: "center", padding: 10, width: '100%' }}>
                    <CircularProgress size={30} />
                </div>
            )}
            {/* Заглушка для подгрузки */}
            {!isLoading && loadIndex < foundData.length && <div ref={observerRef} style={{ height: 50 }} />}
        </>
    );
};

export default LazyLoadTours;
