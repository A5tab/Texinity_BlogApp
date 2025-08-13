
function Input({ label, name, id, type = "text", required = false, multiple = false, className = "", ...props }) {
    return (
        <>
            {label && <label htmlFor={id}>{label}</label>}
            <input type={type} name={name} id={id} required={required} className={`${className} outline outline-accent-hover focus:outline-accent rounded-md p-1`} {...props} />
        </>
    )
}

export default Input