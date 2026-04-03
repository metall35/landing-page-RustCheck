import Card from "@/components/common/Card";

export default function Testimonial({ quote, author, role, rating = 5 }) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex gap-1">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
      </div>
      <p className="mb-4 text-gray-700 italic">"{quote}"</p>
      <div>
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </Card>
  );
}
