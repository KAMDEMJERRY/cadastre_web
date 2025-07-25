interface ParcelleHeaderProps {
  numero: string;
  description: string;
}

export default function ParcelleHeader({ 
  numero, 
  description 
}: ParcelleHeaderProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800">
        Détails de la Parcelle {numero}
      </h2>
      <p className="text-gray-600">{description}</p>
    </section>
  );
}