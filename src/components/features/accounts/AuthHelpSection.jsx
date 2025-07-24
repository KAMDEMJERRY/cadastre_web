export default function AuthHelpSection() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-indigo-500">
      <h3 className="text-base font-medium text-gray-800 mb-2">
        Pour accéder à votre compte :
      </h3>
      <ul className="space-y-1 text-gray-700 text-sm">
        
        <li className="flex items-start">
          <span className="text-indigo-500 mr-2">→</span>
          Saisissez votre email
        </li>
        <li className="flex items-start">
          <span className="text-indigo-500 mr-2">→</span>
          Entrez le mot de passe
        </li>
        <li className="flex items-start">
          <span className="text-indigo-500 mr-2">→</span>
          Contactez l'administration en cas de problème
        </li>
      </ul>
    </div>
  );
}