interface FormInputItemWrapperProps {
    children: string | JSX.Element | JSX.Element[];
    className?: string;
}

/**
 * Компонент обертка, устанавливающий отступы между элементами формы.
 * */
export default function FormInputItemWrapper(props: FormInputItemWrapperProps) {
    return (
        <>
            <div className={["mt-2", props.className || ""].join(" ")}>{props.children}</div>
        </>
    );
}
