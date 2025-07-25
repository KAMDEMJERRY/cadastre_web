interface InfoItem {
  label: string;
  value: string;
  isLink?: boolean;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
}

export default function InfoCard({ title, items }: InfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-2 text-gray-700">
        {items.map((item, index) => (
          <li key={index}>
            <strong>{item.label}:</strong>{' '}
            {item.isLink ? (
              <a href="#" className="text-blue-600 hover:underline">
                {item.value}
              </a>
            ) : (
              <span>{item.value}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}