// src/app/test-api/page.tsx (Server Component)
import { API_BASE_URL, LOGIN_URL, PARCELLEDOC_URL, USER_PROFILE_URL } from  "@/utils/constants/end_points";

export default function TestAPIPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Configuration</h1>
      
      <h2>URLs configurées :</h2>
      <ul>
        <li><strong>API_BASE_URL:</strong> {API_BASE_URL}</li>
        <li><strong>LOGIN_URL:</strong> {LOGIN_URL}</li>
        <li><strong>USER_PROFILE_URL:</strong> {USER_PROFILE_URL}</li>
        <li><strong>PARCELLEDOC_URL:</strong> {PARCELLEDOC_URL}</li>
      </ul>
      
      <h2>Variables d&apos;environnement :</h2>
      <ul>
        <li><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</li>
        <li><strong>NEXT_PUBLIC_VERCEL_ENV:</strong> {process.env.NEXT_PUBLIC_VERCEL_ENV || 'Not set'}</li>
        <li><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</li>
      </ul>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#e3f2fd',
        border: '1px solid #2196f3',
        borderRadius: '5px'
      }}>
        <h3>Instructions :</h3>
        <p>Pour tester la connexion API, utilisez les outils de développement de votre navigateur.</p>
        <p>Ouvrez la console et exécutez :</p>
        <code>
          fetch(&apos;{API_BASE_URL}/health&apos;).then(r =&gt; r.json()).then(console.log)
        </code>
      </div>
    </div>
  );
}