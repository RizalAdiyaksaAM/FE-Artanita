// src/components/card/activity.tsx
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActivityImage {
  image_url: string;
}

interface ActivityProps {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  activity_images: ActivityImage[];
}

const Activity: React.FC<ActivityProps> = ({ 
  id,
  title, 
  location, 
  time, 
  activity_images 
}) => {
  // Format description to limit length

  const navigate = useNavigate();

  const handleNavigateToDetail = () => {
    navigate(`/activity/details/${id}`);
  };

  return (
    <div className="bg-white w-[293px] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      {activity_images && activity_images.length > 0 ? (
        <div className="relative h-56">
          <img
            src={activity_images[0].image_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="bg-gray-200 h-56 flex items-center justify-center">
          <p className="text-gray-500">No Image Available</p>
        </div>
      )}
      <div className="h-1 bg-[#379777]"></div>
      
      <div className="flex flex-col gap-2.5 p-4">
         <div className="flex justify-between items-center gap-2 text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#F4CE14]" />
            <span className="font-semibold text-[12px]">{location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#F4CE14]" />
            <span className="font-semibold text-[12px]">{time}</span>
          </div>
        </div>
        <h2 className="!text-[16px] font-bold mb-3 text-gray-800 line-clamp-1">{title}</h2>

        
          <a onClick={handleNavigateToDetail} className="!text-[#379777] !bg-transparent text-sm flex items-center" href="">
            Read More
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        
      </div>
    </div>
  );
};

export default Activity;