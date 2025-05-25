// src/components/card/donaturs.tsx

interface DonaturProps {
  name: string;
  amount: number;
  message: string;
}

const Donatur: React.FC<DonaturProps> = ({ name, amount, message }) => {
 return (
    <div className="rounded-[20px] shadow-lg  overflow-x-auto h-full  flex flex-col">
      <div className="bg-[#37977780] p-4">
        <h3 className="text-2xl font-semibold !text-black">{name}</h3>
        <p className="font-medium">
          Rp.{amount.toLocaleString("id-ID")}
        </p>
      </div>
      <div className="bg-white p-4 flex-1">
        <p className="text-gray-800">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Donatur;