import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFilteredUsers } from "@/hooks/users/use-users";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion";
import { GraduationCap, MapPin, RotateCcw, Search, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


interface User {
  id: string;
  name: string;
  address: string;
  age: number;
  education: string;
  position: string;
  image: string;
}


export default function AnakAsuh() {
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

  // Card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9 
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(55, 151, 119, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Image animation variants
  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.2
      }
    }
  };

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [filterAddress, setFilterAddress] = useState("all");
  const [filterAge, setFilterAge] = useState("all");
  const [filterEducation, setFilterEducation] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  // List of unique addresses, ages, and education levels for filter options
  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const [ageOptions, setAgeOptions] = useState<string[]>([]);
  const [educationOptions, setEducationOptions] = useState<string[]>([]);

  // Always set position filter to "Anak Asuh"
  const filterPosition = "Anak Asuh";

  const { data, isLoading, refetch } = useFilteredUsers({
    page,
    limit,
    searchName,
    filterAddress,
    filterAge,
    filterEducation,
    filterPosition,
  });

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data?.data) {
      setUsers(data.data);
      
      // Extract unique options for filters
      const addresses = [...new Set(data.data.map(user => user.address))];
      const ages = [...new Set(data.data.map(user => user.age.toString()))];
      const educations = [...new Set(data.data.map(user => user.education))];
      
      setAddressOptions(addresses);
      setAgeOptions(ages);
      setEducationOptions(educations);
    }
  }, [data]);

  const resetFilters = () => {
    setSearchName("");
    setFilterAddress("all");
    setFilterAge("all");
    setFilterEducation("all");
    setPage(1);
    refetch();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const hasUsers = users && users.length > 0;

    // Helper function to determine which page numbers to show
  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const visiblePages = 5; // Number of page buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-[#3797771A] min-h-screen"
    >
      <Navbar />
      <motion.div className="container mx-auto py-12">
        <motion.h2
          variants={itemVariants}
          className=" !text-2xl lg:!text-4xl bg-white w-full !py-4 rounded-lg shadow-lg text-center font-bold !text-[#379777]"
        >
          Anak Asuh
        </motion.h2>

        {/* Filter Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 flex  bg-white rounded-lg shadow-lg p-6"
        >
          <form onSubmit={handleSearch} className=" gap-4  w-full flex flex-col lg:flex-row justify-between ">
            {/* Search Bar */}
            <div className="w-full flex md:flex-row gap-4">
              <div className="relative  flex-1">
                <Input
                  type="text"
                  placeholder="Cari nama anak asuh..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Button type="submit" className="bg-[#379777] !px-6 hover:bg-[#2a7259]">
                Cari
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap lg:flex-nowrap gap-4">
              <div className=" space-y-2 ">
                <Select value={filterAddress} onValueChange={setFilterAddress}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Alamat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all"> <span></span>Semua Alamat</SelectItem>
                    {addressOptions.map((address) => (
                      <SelectItem key={address} value={address}>
                        {address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select value={filterAge} onValueChange={setFilterAge}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Umur" />
                  </SelectTrigger>
                  <SelectContent className="px-4">
                    <SelectItem className="" value="all"> <span></span> Semua Umur</SelectItem>
                    {ageOptions.map((age) => (
                      <SelectItem key={age} value={age}>
                        {age} Tahun
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select value={filterEducation} onValueChange={setFilterEducation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all"> <span></span>Semua Pendidikan</SelectItem>
                    {educationOptions.map((education) => (
                      <SelectItem key={education} value={education}>
                        {education}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetFilters}
                className="flex items-center !text-red-500 gap-2 !px-2"
              >
                <RotateCcw />
                Reset Filter
              </Button>
            </div>
            </div>


            
            
          </form>
        </motion.div>

        {/* User Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-[#379777] font-medium">Loading...</div>
          </div>
        ) : hasUsers ? (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          >
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="cursor-pointer"
              >
                <Card className="py-0 gap-0 overflow-hidden transition-all duration-300 border-0 shadow-md">
                  <div className="overflow-hidden rounded-t-xl">
                    <motion.img
                      variants={imageVariants}
                      src={user.image}
                      alt={user.name}
                      className="w-full h-[274px] object-cover"
                    />
                  </div>
                  <motion.div 
                    className="bg-[#379777] h-1"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  />
                  <CardContent className="p-4">
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.h3 
                        className="!text-lg !mb-2 !text-black font-semibold mt-2 text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {user.name}
                      </motion.h3>
                      <motion.div className="flex justify-between">
                        <motion.div 
                          className="flex justify-center items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <GraduationCap className="h-5 w-5 text-[#379777]" />
                          <motion.p className="!text-[10px] !text-black font-semibold mt-2 text-center">
                            {user.education}
                          </motion.p>
                        </motion.div>
                        <motion.div 
                          className="flex justify-center items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <UsersRound className="h-5 w-5 text-[#379777]" />
                          <motion.p className="!text-[10px] !text-black font-semibold mt-2 text-center">
                            {user.age} <span>Tahun</span>
                          </motion.p>
                        </motion.div>
                        <motion.div 
                          className="flex justify-center items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <MapPin className="h-5 w-5 text-[#379777]" />
                          <motion.p className="!text-[10px] !text-black font-semibold mt-2 text-center">
                            {user.address}
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg p-8 mt-8 text-center"
          >
            <p className="text-gray-500">Tidak ada anak asuh yang ditemukan.</p>
          </motion.div>
        )}

        {/* Pagination with shadcn/ui */}
        {data?.pagination && data.pagination.total_page > 1 && (
          <motion.div variants={itemVariants} className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    href="#"
                  />
                </PaginationItem>
                
                {data.pagination.total_page <= 7 ? (
                  // Show all pages if there are 7 or fewer
                  Array.from({ length: data.pagination.total_page }, (_, i) => i + 1).map(pageNum => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        href="#"
                        onClick={() => setPage(pageNum)}
                        isActive={pageNum === page}
                        className={pageNum === page ? "bg-[#379777] !text-white hover:bg-[#2a7259]" : ""}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))
                ) : (
                  // Show limited pages with ellipsis for larger page counts
                  <>
                    {/* First page */}
                    <PaginationItem>
                      <PaginationLink 
                        href="#"
                        onClick={() => setPage(1)}
                        isActive={page === 1}
                        className={page === 1 ? "bg-[#379777] text-white hover:bg-[#2a7259]" : ""}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    
                    {/* Show ellipsis if not near first page */}
                    {page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Current page range */}
                    {getPageNumbers(page, data.pagination.total_page)
                      .filter(num => num !== 1 && num !== data.pagination.total_page)
                      .map(pageNum => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink 
                            href="#"
                            onClick={() => setPage(pageNum)}
                            isActive={pageNum === page}
                            className={pageNum === page ? "bg-[#379777] text-white hover:bg-[#2a7259]" : ""}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))
                    }
                    
                    {/* Show ellipsis if not near last page */}
                    {page < data.pagination.total_page - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    {/* Last page */}
                    <PaginationItem>
                      <PaginationLink 
                        href="#"
                        onClick={() => setPage(data.pagination.total_page)}
                        isActive={page === data.pagination.total_page}
                        className={page === data.pagination.total_page ? "bg-[#379777] text-white hover:bg-[#2a7259]" : ""}
                      >
                        {data.pagination.total_page}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(prev => Math.min(prev + 1, data.pagination.total_page))} 
                    className={page === data.pagination.total_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    href="#"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </motion.div>
      <Footer />
    </motion.section>
  );
}