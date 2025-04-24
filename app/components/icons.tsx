export const XIcon = ({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 50"
      fill="none"
      className={className}
      role="graphics-symbol"
    >
      <path
        d="M44.1032 0H52.6902L33.9303 21.1793L56 50H38.7196L25.1848 32.5203L9.69791 50H1.10581L21.1718 27.3462L0 0H17.7193L29.9534 15.9769L44.1032 0ZM41.0897 44.9228H45.8478L15.1336 4.81025H10.0277L41.0897 44.9228Z"
        fill="currentColor"
      />
    </svg>
  );
};
