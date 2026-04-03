import Card from "@/components/common/Card";

export default function FeatureGrid({ features, cols = 3 }) {
  const colsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid gap-6 ${colsClass[cols]}`}>
      {features.map((feature, idx) => (
        <Card key={idx} className="p-6">
          {feature.icon && (
            <div className="mb-4 text-3xl">{feature.icon}</div>
          )}
          <h3 className="mb-2 font-semibold text-gray-900">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
}
