import {useEffect, useState} from "react";

type NumberAnimationProps = {
    targetValue: number
}

export default function NumberAnimation(props: NumberAnimationProps) {

    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        const animationDuration = 2000; // Dauer der Animation in Millisekunden
        const updateInterval = 20; // Aktualisierungsintervall in Millisekunden
        const steps = Math.ceil(animationDuration / updateInterval);
        const stepValue = props.targetValue / steps;

        let step = 0;

        const animationInterval = setInterval(() => {
            setCurrentValue(prevValue => prevValue + stepValue);
            step++;

            if (step >= steps) {
                setCurrentValue(props.targetValue);
                clearInterval(animationInterval);
            }
        }, updateInterval);

        return () => {
            clearInterval(animationInterval); // Reinige das Intervall, wenn die Komponente zerstört wird
        };
    }, []);

    return (
        <div className="number text-[24px] font-bold">{Math.round(currentValue)}</div>
    )
}
