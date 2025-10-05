import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import { Filter, ChevronUp, ChevronDown } from "lucide-react";

export default function Filters() {
    // Filter visibility state
    const [showFilters, setShowFilters] = useState(false);

    // Demographic filters
    const [incomeRange, setIncomeRange] = useState("");
    const [race, setRace] = useState("");
    const [ageRange, setAgeRange] = useState("");
    const [schoolLevel, setSchoolLevel] = useState("");
    const [maritalStatus, setMaritalStatus] = useState("");
    const [children, setChildren] = useState("");
    const [location, setLocation] = useState("");
    const [homeOwnership, setHomeOwnership] = useState("");
    const [vehicleOwnership, setVehicleOwnership] = useState("");

    // Professional filters
    const [industry, setIndustry] = useState("");
    const [employmentStatus, setEmploymentStatus] = useState("");
    const [workSchedule, setWorkSchedule] = useState("");

    // Personal filters
    const [politicalAffiliation, setPoliticalAffiliation] = useState("");
    const [religion, setReligion] = useState("");
    const [language, setLanguage] = useState("");

    // Lifestyle filters
    const [hobbies, setHobbies] = useState("");
    const [socialMediaUsage, setSocialMediaUsage] = useState("");
    const [shoppingBehavior, setShoppingBehavior] = useState("");
    const [brandLoyalty, setBrandLoyalty] = useState("");
    const [techSavviness, setTechSavviness] = useState("");
    const [healthConsciousness, setHealthConsciousness] = useState("");
    const [environmentalConcern, setEnvironmentalConcern] = useState("");
    const [travelFrequency, setTravelFrequency] = useState("");
    const [diningPreferences, setDiningPreferences] = useState("");
    const [entertainmentPreferences, setEntertainmentPreferences] =
        useState("");
    const [fitnessLevel, setFitnessLevel] = useState("");
    const [sleepPattern, setSleepPattern] = useState("");
    const [stressLevel, setStressLevel] = useState("");

    // Behavioral filters
    const [riskTolerance, setRiskTolerance] = useState("");
    const [communicationStyle, setCommunicationStyle] = useState("");
    const [decisionMakingStyle, setDecisionMakingStyle] = useState("");
    const [values, setValues] = useState("");
    const [lifestyle, setLifestyle] = useState("");
    const [personalityType, setPersonalityType] = useState("");
    return (
        <>
            <div className="mb-6">
                <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="ghost"
                    className="w-full text-white/70 hover:text-white hover:bg-white/5 border border-white/10 bg-transparent py-3"
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Additional Filters
                    {showFilters ? (
                        <ChevronUp className="w-4 h-4 ml-2" />
                    ) : (
                        <ChevronDown className="w-4 h-4 ml-2" />
                    )}
                </Button>
            </div>

            {/* Collapsible Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div
                            className="rounded-2xl p-6 mb-6 max-h-96 overflow-y-auto"
                            style={{
                                background: "rgba(0, 0, 0, 0.6)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Income Range */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Income Range
                                    </label>
                                    <Select
                                        value={incomeRange}
                                        onValueChange={setIncomeRange}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select income range" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="under-30k">
                                                Under $30,000
                                            </SelectItem>
                                            <SelectItem value="30k-50k">
                                                $30,000 - $50,000
                                            </SelectItem>
                                            <SelectItem value="50k-75k">
                                                $50,000 - $75,000
                                            </SelectItem>
                                            <SelectItem value="75k-100k">
                                                $75,000 - $100,000
                                            </SelectItem>
                                            <SelectItem value="100k-150k">
                                                $100,000 - $150,000
                                            </SelectItem>
                                            <SelectItem value="over-150k">
                                                Over $150,000
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Race */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Race/Ethnicity
                                    </label>
                                    <Select
                                        value={race}
                                        onValueChange={setRace}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select race/ethnicity" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="white">
                                                White
                                            </SelectItem>
                                            <SelectItem value="black">
                                                Black/African American
                                            </SelectItem>
                                            <SelectItem value="hispanic">
                                                Hispanic/Latino
                                            </SelectItem>
                                            <SelectItem value="asian">
                                                Asian
                                            </SelectItem>
                                            <SelectItem value="native">
                                                Native American
                                            </SelectItem>
                                            <SelectItem value="pacific">
                                                Pacific Islander
                                            </SelectItem>
                                            <SelectItem value="mixed">
                                                Mixed Race
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Age Range */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Age Range
                                    </label>
                                    <Select
                                        value={ageRange}
                                        onValueChange={setAgeRange}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select age range" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="18-24">
                                                18-24
                                            </SelectItem>
                                            <SelectItem value="25-34">
                                                25-34
                                            </SelectItem>
                                            <SelectItem value="35-44">
                                                35-44
                                            </SelectItem>
                                            <SelectItem value="45-54">
                                                45-54
                                            </SelectItem>
                                            <SelectItem value="55-64">
                                                55-64
                                            </SelectItem>
                                            <SelectItem value="65+">
                                                65+
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Education Level */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Education Level
                                    </label>
                                    <Select
                                        value={schoolLevel}
                                        onValueChange={setSchoolLevel}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="high-school">
                                                High School
                                            </SelectItem>
                                            <SelectItem value="some-college">
                                                Some College
                                            </SelectItem>
                                            <SelectItem value="associates">
                                                Associate's Degree
                                            </SelectItem>
                                            <SelectItem value="bachelors">
                                                Bachelor's Degree
                                            </SelectItem>
                                            <SelectItem value="masters">
                                                Master's Degree
                                            </SelectItem>
                                            <SelectItem value="doctorate">
                                                Doctorate/PhD
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Marital Status */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Marital Status
                                    </label>
                                    <Select
                                        value={maritalStatus}
                                        onValueChange={setMaritalStatus}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select marital status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="single">
                                                Single
                                            </SelectItem>
                                            <SelectItem value="married">
                                                Married
                                            </SelectItem>
                                            <SelectItem value="divorced">
                                                Divorced
                                            </SelectItem>
                                            <SelectItem value="widowed">
                                                Widowed
                                            </SelectItem>
                                            <SelectItem value="separated">
                                                Separated
                                            </SelectItem>
                                            <SelectItem value="cohabiting">
                                                Cohabiting
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Children */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Children
                                    </label>
                                    <Select
                                        value={children}
                                        onValueChange={setChildren}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select children status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="none">
                                                No Children
                                            </SelectItem>
                                            <SelectItem value="1">
                                                1 Child
                                            </SelectItem>
                                            <SelectItem value="2">
                                                2 Children
                                            </SelectItem>
                                            <SelectItem value="3">
                                                3 Children
                                            </SelectItem>
                                            <SelectItem value="4+">
                                                4+ Children
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Location
                                    </label>
                                    <Select
                                        value={location}
                                        onValueChange={setLocation}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="urban">
                                                Urban
                                            </SelectItem>
                                            <SelectItem value="suburban">
                                                Suburban
                                            </SelectItem>
                                            <SelectItem value="rural">
                                                Rural
                                            </SelectItem>
                                            <SelectItem value="northeast">
                                                Northeast
                                            </SelectItem>
                                            <SelectItem value="southeast">
                                                Southeast
                                            </SelectItem>
                                            <SelectItem value="midwest">
                                                Midwest
                                            </SelectItem>
                                            <SelectItem value="southwest">
                                                Southwest
                                            </SelectItem>
                                            <SelectItem value="west">
                                                West Coast
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Home Ownership */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Home Ownership
                                    </label>
                                    <Select
                                        value={homeOwnership}
                                        onValueChange={setHomeOwnership}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select home ownership" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="own">
                                                Own
                                            </SelectItem>
                                            <SelectItem value="rent">
                                                Rent
                                            </SelectItem>
                                            <SelectItem value="live-with-family">
                                                Live with Family
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Vehicle Ownership */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Vehicle Ownership
                                    </label>
                                    <Select
                                        value={vehicleOwnership}
                                        onValueChange={setVehicleOwnership}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select vehicle ownership" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="none">
                                                No Vehicle
                                            </SelectItem>
                                            <SelectItem value="1">
                                                1 Vehicle
                                            </SelectItem>
                                            <SelectItem value="2">
                                                2 Vehicles
                                            </SelectItem>
                                            <SelectItem value="3+">
                                                3+ Vehicles
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Industry */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Industry
                                    </label>
                                    <Select
                                        value={industry}
                                        onValueChange={setIndustry}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="technology">
                                                Technology
                                            </SelectItem>
                                            <SelectItem value="healthcare">
                                                Healthcare
                                            </SelectItem>
                                            <SelectItem value="finance">
                                                Finance
                                            </SelectItem>
                                            <SelectItem value="education">
                                                Education
                                            </SelectItem>
                                            <SelectItem value="retail">
                                                Retail
                                            </SelectItem>
                                            <SelectItem value="manufacturing">
                                                Manufacturing
                                            </SelectItem>
                                            <SelectItem value="entertainment">
                                                Entertainment
                                            </SelectItem>
                                            <SelectItem value="real-estate">
                                                Real Estate
                                            </SelectItem>
                                            <SelectItem value="consulting">
                                                Consulting
                                            </SelectItem>
                                            <SelectItem value="nonprofit">
                                                Non-profit
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Employment Status */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Employment Status
                                    </label>
                                    <Select
                                        value={employmentStatus}
                                        onValueChange={setEmploymentStatus}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select employment status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="employed">
                                                Employed
                                            </SelectItem>
                                            <SelectItem value="unemployed">
                                                Unemployed
                                            </SelectItem>
                                            <SelectItem value="student">
                                                Student
                                            </SelectItem>
                                            <SelectItem value="retired">
                                                Retired
                                            </SelectItem>
                                            <SelectItem value="self-employed">
                                                Self-Employed
                                            </SelectItem>
                                            <SelectItem value="freelancer">
                                                Freelancer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Work Schedule */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Work Schedule
                                    </label>
                                    <Select
                                        value={workSchedule}
                                        onValueChange={setWorkSchedule}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select work schedule" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="full-time">
                                                Full-time
                                            </SelectItem>
                                            <SelectItem value="part-time">
                                                Part-time
                                            </SelectItem>
                                            <SelectItem value="remote">
                                                Remote
                                            </SelectItem>
                                            <SelectItem value="hybrid">
                                                Hybrid
                                            </SelectItem>
                                            <SelectItem value="flexible">
                                                Flexible
                                            </SelectItem>
                                            <SelectItem value="shift-work">
                                                Shift Work
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Political Affiliation */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Political Affiliation
                                    </label>
                                    <Select
                                        value={politicalAffiliation}
                                        onValueChange={setPoliticalAffiliation}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select political affiliation" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="liberal">
                                                Liberal
                                            </SelectItem>
                                            <SelectItem value="conservative">
                                                Conservative
                                            </SelectItem>
                                            <SelectItem value="moderate">
                                                Moderate
                                            </SelectItem>
                                            <SelectItem value="independent">
                                                Independent
                                            </SelectItem>
                                            <SelectItem value="apolitical">
                                                Apolitical
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Religion */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Religion
                                    </label>
                                    <Select
                                        value={religion}
                                        onValueChange={setReligion}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="christian">
                                                Christian
                                            </SelectItem>
                                            <SelectItem value="catholic">
                                                Catholic
                                            </SelectItem>
                                            <SelectItem value="jewish">
                                                Jewish
                                            </SelectItem>
                                            <SelectItem value="muslim">
                                                Muslim
                                            </SelectItem>
                                            <SelectItem value="hindu">
                                                Hindu
                                            </SelectItem>
                                            <SelectItem value="buddhist">
                                                Buddhist
                                            </SelectItem>
                                            <SelectItem value="atheist">
                                                Atheist
                                            </SelectItem>
                                            <SelectItem value="agnostic">
                                                Agnostic
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Language */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Primary Language
                                    </label>
                                    <Select
                                        value={language}
                                        onValueChange={setLanguage}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select primary language" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="english">
                                                English
                                            </SelectItem>
                                            <SelectItem value="spanish">
                                                Spanish
                                            </SelectItem>
                                            <SelectItem value="chinese">
                                                Chinese
                                            </SelectItem>
                                            <SelectItem value="french">
                                                French
                                            </SelectItem>
                                            <SelectItem value="german">
                                                German
                                            </SelectItem>
                                            <SelectItem value="japanese">
                                                Japanese
                                            </SelectItem>
                                            <SelectItem value="arabic">
                                                Arabic
                                            </SelectItem>
                                            <SelectItem value="other">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Hobbies */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Primary Hobbies
                                    </label>
                                    <Select
                                        value={hobbies}
                                        onValueChange={setHobbies}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select hobbies" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="sports">
                                                Sports
                                            </SelectItem>
                                            <SelectItem value="music">
                                                Music
                                            </SelectItem>
                                            <SelectItem value="reading">
                                                Reading
                                            </SelectItem>
                                            <SelectItem value="gaming">
                                                Gaming
                                            </SelectItem>
                                            <SelectItem value="cooking">
                                                Cooking
                                            </SelectItem>
                                            <SelectItem value="gardening">
                                                Gardening
                                            </SelectItem>
                                            <SelectItem value="travel">
                                                Travel
                                            </SelectItem>
                                            <SelectItem value="art">
                                                Art
                                            </SelectItem>
                                            <SelectItem value="photography">
                                                Photography
                                            </SelectItem>
                                            <SelectItem value="fitness">
                                                Fitness
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Social Media Usage */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Social Media Usage
                                    </label>
                                    <Select
                                        value={socialMediaUsage}
                                        onValueChange={setSocialMediaUsage}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select social media usage" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="heavy">
                                                Heavy User
                                            </SelectItem>
                                            <SelectItem value="moderate">
                                                Moderate User
                                            </SelectItem>
                                            <SelectItem value="light">
                                                Light User
                                            </SelectItem>
                                            <SelectItem value="minimal">
                                                Minimal User
                                            </SelectItem>
                                            <SelectItem value="none">
                                                No Social Media
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Shopping Behavior */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Shopping Behavior
                                    </label>
                                    <Select
                                        value={shoppingBehavior}
                                        onValueChange={setShoppingBehavior}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select shopping behavior" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="online">
                                                Online Shopper
                                            </SelectItem>
                                            <SelectItem value="in-store">
                                                In-Store Shopper
                                            </SelectItem>
                                            <SelectItem value="mixed">
                                                Mixed
                                            </SelectItem>
                                            <SelectItem value="bargain-hunter">
                                                Bargain Hunter
                                            </SelectItem>
                                            <SelectItem value="luxury">
                                                Luxury Shopper
                                            </SelectItem>
                                            <SelectItem value="impulse">
                                                Impulse Buyer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Brand Loyalty */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Brand Loyalty
                                    </label>
                                    <Select
                                        value={brandLoyalty}
                                        onValueChange={setBrandLoyalty}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select brand loyalty" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="high">
                                                High Loyalty
                                            </SelectItem>
                                            <SelectItem value="moderate">
                                                Moderate Loyalty
                                            </SelectItem>
                                            <SelectItem value="low">
                                                Low Loyalty
                                            </SelectItem>
                                            <SelectItem value="brand-switcher">
                                                Brand Switcher
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Tech Savviness */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Tech Savviness
                                    </label>
                                    <Select
                                        value={techSavviness}
                                        onValueChange={setTechSavviness}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select tech savviness" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="expert">
                                                Expert
                                            </SelectItem>
                                            <SelectItem value="advanced">
                                                Advanced
                                            </SelectItem>
                                            <SelectItem value="intermediate">
                                                Intermediate
                                            </SelectItem>
                                            <SelectItem value="beginner">
                                                Beginner
                                            </SelectItem>
                                            <SelectItem value="novice">
                                                Novice
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Health Consciousness */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Health Consciousness
                                    </label>
                                    <Select
                                        value={healthConsciousness}
                                        onValueChange={setHealthConsciousness}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select health consciousness" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="very-high">
                                                Very High
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High
                                            </SelectItem>
                                            <SelectItem value="moderate">
                                                Moderate
                                            </SelectItem>
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="very-low">
                                                Very Low
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Environmental Concern */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Environmental Concern
                                    </label>
                                    <Select
                                        value={environmentalConcern}
                                        onValueChange={setEnvironmentalConcern}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select environmental concern" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="very-high">
                                                Very High
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High
                                            </SelectItem>
                                            <SelectItem value="moderate">
                                                Moderate
                                            </SelectItem>
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="very-low">
                                                Very Low
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Travel Frequency */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Travel Frequency
                                    </label>
                                    <Select
                                        value={travelFrequency}
                                        onValueChange={setTravelFrequency}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select travel frequency" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="frequent">
                                                Frequent Traveler
                                            </SelectItem>
                                            <SelectItem value="regular">
                                                Regular Traveler
                                            </SelectItem>
                                            <SelectItem value="occasional">
                                                Occasional Traveler
                                            </SelectItem>
                                            <SelectItem value="rare">
                                                Rare Traveler
                                            </SelectItem>
                                            <SelectItem value="never">
                                                Never Travel
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Dining Preferences */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Dining Preferences
                                    </label>
                                    <Select
                                        value={diningPreferences}
                                        onValueChange={setDiningPreferences}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select dining preferences" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="fine-dining">
                                                Fine Dining
                                            </SelectItem>
                                            <SelectItem value="casual">
                                                Casual Dining
                                            </SelectItem>
                                            <SelectItem value="fast-food">
                                                Fast Food
                                            </SelectItem>
                                            <SelectItem value="home-cooking">
                                                Home Cooking
                                            </SelectItem>
                                            <SelectItem value="takeout">
                                                Takeout
                                            </SelectItem>
                                            <SelectItem value="foodie">
                                                Foodie
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Entertainment Preferences */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Entertainment Preferences
                                    </label>
                                    <Select
                                        value={entertainmentPreferences}
                                        onValueChange={
                                            setEntertainmentPreferences
                                        }
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select entertainment preferences" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="movies">
                                                Movies
                                            </SelectItem>
                                            <SelectItem value="tv-shows">
                                                TV Shows
                                            </SelectItem>
                                            <SelectItem value="streaming">
                                                Streaming
                                            </SelectItem>
                                            <SelectItem value="live-events">
                                                Live Events
                                            </SelectItem>
                                            <SelectItem value="gaming">
                                                Gaming
                                            </SelectItem>
                                            <SelectItem value="reading">
                                                Reading
                                            </SelectItem>
                                            <SelectItem value="music">
                                                Music
                                            </SelectItem>
                                            <SelectItem value="sports">
                                                Sports
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Fitness Level */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Fitness Level
                                    </label>
                                    <Select
                                        value={fitnessLevel}
                                        onValueChange={setFitnessLevel}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select fitness level" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="athletic">
                                                Athletic
                                            </SelectItem>
                                            <SelectItem value="active">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="moderate">
                                                Moderate
                                            </SelectItem>
                                            <SelectItem value="sedentary">
                                                Sedentary
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                Inactive
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sleep Pattern */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Sleep Pattern
                                    </label>
                                    <Select
                                        value={sleepPattern}
                                        onValueChange={setSleepPattern}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select sleep pattern" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="early-bird">
                                                Early Bird
                                            </SelectItem>
                                            <SelectItem value="night-owl">
                                                Night Owl
                                            </SelectItem>
                                            <SelectItem value="regular">
                                                Regular Schedule
                                            </SelectItem>
                                            <SelectItem value="irregular">
                                                Irregular
                                            </SelectItem>
                                            <SelectItem value="insomniac">
                                                Insomniac
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Stress Level */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Stress Level
                                    </label>
                                    <Select
                                        value={stressLevel}
                                        onValueChange={setStressLevel}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select stress level" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="very-high">
                                                Very High
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High
                                            </SelectItem>
                                            <SelectItem value="moderate">
                                                Moderate
                                            </SelectItem>
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="very-low">
                                                Very Low
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Risk Tolerance */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Risk Tolerance
                                    </label>
                                    <Select
                                        value={riskTolerance}
                                        onValueChange={setRiskTolerance}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select risk tolerance" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="very-high">
                                                Very High
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High
                                            </SelectItem>
                                            <SelectItem value="moderate">
                                                Moderate
                                            </SelectItem>
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="very-low">
                                                Very Low
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Communication Style */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Communication Style
                                    </label>
                                    <Select
                                        value={communicationStyle}
                                        onValueChange={setCommunicationStyle}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select communication style" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="direct">
                                                Direct
                                            </SelectItem>
                                            <SelectItem value="diplomatic">
                                                Diplomatic
                                            </SelectItem>
                                            <SelectItem value="analytical">
                                                Analytical
                                            </SelectItem>
                                            <SelectItem value="expressive">
                                                Expressive
                                            </SelectItem>
                                            <SelectItem value="reserved">
                                                Reserved
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Decision Making Style */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Decision Making Style
                                    </label>
                                    <Select
                                        value={decisionMakingStyle}
                                        onValueChange={setDecisionMakingStyle}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select decision making style" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="analytical">
                                                Analytical
                                            </SelectItem>
                                            <SelectItem value="intuitive">
                                                Intuitive
                                            </SelectItem>
                                            <SelectItem value="collaborative">
                                                Collaborative
                                            </SelectItem>
                                            <SelectItem value="decisive">
                                                Decisive
                                            </SelectItem>
                                            <SelectItem value="hesitant">
                                                Hesitant
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Values */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Core Values
                                    </label>
                                    <Select
                                        value={values}
                                        onValueChange={setValues}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select core values" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="family">
                                                Family
                                            </SelectItem>
                                            <SelectItem value="career">
                                                Career
                                            </SelectItem>
                                            <SelectItem value="adventure">
                                                Adventure
                                            </SelectItem>
                                            <SelectItem value="security">
                                                Security
                                            </SelectItem>
                                            <SelectItem value="creativity">
                                                Creativity
                                            </SelectItem>
                                            <SelectItem value="service">
                                                Service
                                            </SelectItem>
                                            <SelectItem value="achievement">
                                                Achievement
                                            </SelectItem>
                                            <SelectItem value="freedom">
                                                Freedom
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Lifestyle */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Lifestyle
                                    </label>
                                    <Select
                                        value={lifestyle}
                                        onValueChange={setLifestyle}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select lifestyle" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="minimalist">
                                                Minimalist
                                            </SelectItem>
                                            <SelectItem value="luxury">
                                                Luxury
                                            </SelectItem>
                                            <SelectItem value="balanced">
                                                Balanced
                                            </SelectItem>
                                            <SelectItem value="busy">
                                                Busy
                                            </SelectItem>
                                            <SelectItem value="relaxed">
                                                Relaxed
                                            </SelectItem>
                                            <SelectItem value="adventurous">
                                                Adventurous
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Personality Type */}
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70 font-medium">
                                        Personality Type
                                    </label>
                                    <Select
                                        value={personalityType}
                                        onValueChange={setPersonalityType}
                                    >
                                        <SelectTrigger className="bg-transparent border-white/20 text-white">
                                            <SelectValue placeholder="Select personality type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            <SelectItem value="introvert">
                                                Introvert
                                            </SelectItem>
                                            <SelectItem value="extrovert">
                                                Extrovert
                                            </SelectItem>
                                            <SelectItem value="ambivert">
                                                Ambivert
                                            </SelectItem>
                                            <SelectItem value="analytical">
                                                Analytical
                                            </SelectItem>
                                            <SelectItem value="creative">
                                                Creative
                                            </SelectItem>
                                            <SelectItem value="practical">
                                                Practical
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
