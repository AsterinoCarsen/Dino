interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export default function Card({ children, title, className = ''}: CardProps) {
    return (
        <section className={`bg-dino-card border border-dino-border rounded-2xl p-6 mb-8 shadow-lg transition hover:shadow-xl ${className}`}>
            {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
            {children}
        </section>
    )
}