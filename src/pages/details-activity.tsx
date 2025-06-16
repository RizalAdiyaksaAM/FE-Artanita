import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, type JSX } from "react";
import useActivityDetail from "@/api/orphanage-activity/get-by-id-activity";
import { Calendar, MapPin, Image, Film, ArrowLeft } from "lucide-react";
import DonationForm from "@/components/form/donation";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

// TypeScript interfaces
interface ActivityImage {
  image_url: string;
}

interface ActivityVideo {
  video_url: string;
}

interface Activity {
  title: string;
  location: string;
  time: string;
  description: string;
  activity_images?: ActivityImage[];
  activity_videos?: ActivityVideo[];
}



interface Tab {
  id: "image" | "video";
  label: string;
  icon: typeof Image;
}

type MediaType = "image" | "video";

export default function ActivityDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for active media
  const [activeMediaType, setActiveMediaType] = useState<MediaType>("image");
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  
  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const mediaVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };
  
  // Media tabs
  const tabs: Tab[] = [
    { id: "image", label: "Gambar", icon: Image },
    { id: "video", label: "Video", icon: Film },
  ];
  
  // Gunakan custom hook untuk mendapatkan data aktivitas
  const { 
    data: activityData, 
    isLoading, 
    error 
  } = useActivityDetail(id);

  // Reset active media index saat data berubah
  useEffect(() => {
    setActiveMediaType("image");
    setActiveMediaIndex(0);
  }, [activityData]);

  // Handle kembali ke halaman aktivitas
  const handleBackToActivities = (): void => {
    navigate("/activity");
  };

  // Handle media type change
  const handleMediaTypeChange = (tabId: MediaType): void => {
    setActiveMediaType(tabId);
    setActiveMediaIndex(0);
  };

  // Handle media index change
  const handleMediaIndexChange = (index: number): void => {
    setActiveMediaIndex(index);
  };

  if (isLoading) {
    return (
      <motion.div 
        className="container py-20 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#379777]"></div>
      </motion.div>
    );
  }

  if (error || !activityData || activityData.status !== "success") {
    return (
      <motion.div 
        className="container py-20 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
  
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error?.message || "Data aktivitas tidak ditemukan"}</p>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button 
            className="mt-6 bg-[#379777] hover:bg-[#2a7259]"
            onClick={handleBackToActivities}
          >
            Kembali ke Daftar Aktivitas
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const activity: Activity = activityData.data;
  const hasImages: boolean = Boolean(activity.activity_images && activity.activity_images.length > 0);
  const hasVideos: boolean = Boolean(activity.activity_videos && activity.activity_videos.length > 0);
  const hasMedia: boolean = hasImages || hasVideos;
  
  // Select the currently active media
  const activeMedia = activeMediaType === "image" 
    ? (hasImages ? activity.activity_images! : []) 
    : (hasVideos ? activity.activity_videos! : []);

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
            <Navbar />
      <motion.div className="container" variants={itemVariants}>
        {/* Navigasi Kembali */}
        <motion.div className="mb-6" variants={itemVariants}>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button 
              variant="ghost" 
              className="flex items-center hover:bg-transparent gap-2 text-[#379777] hover:text-[#2a7259]"
              onClick={handleBackToActivities}
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Aktivitas
            </Button>
          </motion.div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galeri Media (Kolom Kiri pada Desktop) */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            {/* Media Type Tabs */}
            {hasVideos && hasImages && (
              <motion.div 
                className="flex justify-center w-full mb-4 space-x-6"
                variants={itemVariants}
              >
                {tabs.map((tab) => (
                  <motion.div
                    key={tab.id}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      variant={activeMediaType === tab.id ? "default" : "outline"}
                      className={`flex items-center !px-[34px] py-2 text-sm font-medium rounded-md transition-colors duration-200
                        ${activeMediaType === tab.id 
                          ? "bg-[#379777] text-white hover:bg-[#2a7259]" 
                          : "text-gray-700 border border-gray-300 hover:border-[#379777] hover:text-[#379777]"}
                      `}
                      onClick={() => handleMediaTypeChange(tab.id)}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Main Media Display */}
            <motion.div 
              className="mb-4"
              variants={mediaVariants}
              key={`${activeMediaType}-${activeMediaIndex}`}
            >
              {hasMedia ? (
                activeMediaType === "image" ? (
                  hasImages && (
                    <img 
                      src={activity.activity_images![activeMediaIndex].image_url} 
                      alt={`${activity.title} - gambar ${activeMediaIndex + 1}`}
                      className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                    />
                  )
                ) : (
                  hasVideos && (
                    <video 
                      src={activity.activity_videos![activeMediaIndex].video_url}
                      className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                      controls
                      autoPlay={false}
                    />
                  )
                )
              ) : (
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">Tidak ada media</p>
                </div>
              )}
            </motion.div>
            
            {/* Thumbnail Images/Videos */}
            {activeMedia.length > 1 && (
              <motion.div 
                className="grid grid-cols-5 gap-2"
                variants={itemVariants}
              >
                {activeMedia.map((media, index) => (
                  <motion.div 
                    key={activeMediaType === "image" ? (media as ActivityImage).image_url : (media as ActivityVideo).video_url}
                    className={`
                      cursor-pointer border-2 rounded overflow-hidden transition-all duration-200
                      ${index === activeMediaIndex ? 'border-[#379777] shadow-md' : 'border-transparent hover:border-gray-300'}
                    `}
                    onClick={() => handleMediaIndexChange(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeMediaType === "image" ? (
                      <img 
                        src={(media as ActivityImage).image_url} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-20 bg-gray-100">
                        <video 
                          src={(media as ActivityVideo).video_url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Film className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Detail Aktivitas */}
            <motion.div className="mt-8" variants={itemVariants}>
              <motion.h1 
                className="!text-4xl font-bold !mb-2"
                variants={itemVariants}
              >
                {activity.title}
              </motion.h1>
              
              <motion.div 
                className="flex gap-20 items-center text-gray-600"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-[#F4CE14]" />
                  <span className="font-semibold text-sm">{activity.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-[#F4CE14]" />
                  <span className="font-semibold text-sm">{activity.time}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="prose max-w-none mt-4"
                variants={itemVariants}
              >
                <h2 className="!text-xl font-semibold !mb-2">Deskripsi Kegiatan</h2>
                <p className="text-gray-700 whitespace-pre-line">{activity.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Donation Form */}
          <motion.div 
            className="p-6 rounded-lg shadow-xl border-2"
            variants={itemVariants}
          >
            <DonationForm />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <Footer />
    </motion.section>
  );
}