export default function Heading({ 
  as = "h2", 
  children, 
  className = "",
  size = "lg"
}) {
  const sizes = {
    xs: "text-lg font-semibold",
    sm: "text-xl font-semibold",
    md: "text-2xl font-bold",
    lg: "text-3xl md:text-4xl font-bold",
    xl: "text-4xl md:text-5xl font-bold"
  };

  const Component = as;
  return (
    <Component className={`${sizes[size]} ${className}`}>
      {children}
    </Component>
  );
}
