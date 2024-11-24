import AmbulanceMap from "./AmbulanceMap";
import EmergencyForm from "./EmergencyForm";

export default function AmbulancePage() {
  return (
    <div className="bg-white text-black min-h-screen p-4 mt-16">
      <h1 className="text-3xl font-bold mb-4">Ambulance Route Simulation</h1>
      <AmbulanceMap />
      <EmergencyForm />
    </div>
  );
}
