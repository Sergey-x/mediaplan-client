import React, { useEffect, useRef } from "react";

export default function useScroll(
    parentRef: React.MutableRefObject<any> | undefined,
    childRef: React.MutableRefObject<any>,
    callback: () => void
) {
    const observer: React.MutableRefObject<any> = useRef();

    useEffect(() => {
        const childRefCurrent = childRef.current;
        const options: IntersectionObserverInit = {
            rootMargin: "0px",
            threshold: 0,
        };

        if (parentRef !== undefined) {
            options.root = parentRef.current;
        }

        observer.current = new IntersectionObserver(([target]) => {
            if (target.isIntersecting) {
                console.log("intersection");
                callback();
            }
        }, options);

        observer.current.observe(childRef.current);

        return function () {
            observer.current.unobserve(childRefCurrent);
        };
    }, [callback, childRef, parentRef]);
}
