"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import apiClient from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { listingSchema } from "@/lib/validations/listing";
import { z } from "zod";


export interface ListingInitialData {
  purpose?: string;
  propertyTypeTab?: string;
  subtype?: string;
  city?: string;
  province?: string;
  location?: string;
  lat?: number;
  lng?: number;
  areaSize?: string | number;
  areaUnit?: string;
  price?: string | number;
  currency?: string;
  installment?: boolean;
  readyForPossession?: boolean;
  bedrooms?: string;
  bathrooms?: string;
  selectedAmenities?: string[];
  title?: string;
  description?: string;
  images?: string[];      // existing URLs (not File objects)
  videoLinks?: string[];
  contactEmail?: string;
  mobileNumbers?: string[];
  landline?: string;
}

export function usePostListingForm(initialData?: ListingInitialData) {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  // Section 1 – Location & Purpose
  const [purpose, setPurpose] = useState(initialData?.purpose ?? "Sell");
  const [propertyTypeTab, setPropertyTypeTab] = useState(initialData?.propertyTypeTab ?? "home");
  const [subtype, setSubtype] = useState(initialData?.subtype ?? "House");
  const [city, setCity] = useState(initialData?.city ?? "");
  const [province, setProvince] = useState(initialData?.province ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [lat, setLat] = useState<number>(initialData?.lat ?? 31.5204);
  const [lng, setLng] = useState<number>(initialData?.lng ?? 74.3587);

  // Section 2 – Price & Area
  const [areaSize, setAreaSize] = useState(String(initialData?.areaSize ?? ""));
  const [areaUnit, setAreaUnit] = useState(initialData?.areaUnit ?? "Sq. Ft.");
  const [price, setPrice] = useState(String(initialData?.price ?? ""));
  const [currency, setCurrency] = useState(initialData?.currency ?? "PKR");
  const [installment, setInstallment] = useState(initialData?.installment ?? false);
  const [readyForPossession, setReadyForPossession] = useState(initialData?.readyForPossession ?? false);

  // Section 3 – Features & Amenities
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms ?? "");
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms ?? "");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.selectedAmenities ?? []);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  // Section 4 – Ad Information
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");

  // Section 5 – Images & Videos
  // existingImageUrls holds URLs already stored on the server (edit mode only)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(initialData?.images ?? []);
  const [images, setImages] = useState<Array<{ id: string; file: File }>>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>(initialData?.videoLinks ?? []);
  const [videoInput, setVideoInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Section 6 – Contact
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail ?? user?.email ?? "");
  const [mobileNumbers, setMobileNumbers] = useState<Array<string | undefined>>(
    initialData?.mobileNumbers?.length ? initialData.mobileNumbers : [""]
  );
  const [landline, setLandline] = useState<string | undefined>(initialData?.landline ?? "");

  // Section 7 – Platform
  const [platformRPF, setPlatformRPF] = useState(true);

  // ─── Derived ───────────────────────────────────────────────────────────────
  const amenityScore = Math.min(100, Math.round((selectedAmenities.length / 5) * 100));
  const imageScore = Math.min(100, Math.round((images.length / 5) * 100));

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 20) {
      toast.warning(`Maximum 20 images allowed. You can only add ${20 - images.length} more.`);
    }

    const newImages = files.slice(0, 20 - images.length).map(file => ({
      id: Math.random().toString(36).substring(7) + "-" + Date.now(),
      file
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const reorderImages = (oldIndex: number, newIndex: number) => {
    setImages((prev) => {
      const newArr = [...prev];
      const [movedItem] = newArr.splice(oldIndex, 1);
      newArr.splice(newIndex, 0, movedItem);
      return newArr;
    });
  };

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const addVideoLink = () => {
    if (videoInput.trim()) {
      setVideoLinks((prev) => [...prev, videoInput.trim()]);
      setVideoInput("");
    }
  };

  const removeVideoLink = (i: number) =>
    setVideoLinks((prev) => prev.filter((_, j) => j !== i));

  const addMobileNumber = () =>
    setMobileNumbers((prev) => [...prev, undefined]);

  const updateMobileNumber = (idx: number, val: string | undefined) => {
    setMobileNumbers((prev) => {
      const updated = [...prev];
      updated[idx] = val;
      return updated;
    });
  };

  const removeMobileNumber = (idx: number) =>
    setMobileNumbers((prev) => prev.filter((_, i) => i !== idx));

  /** Builds a FormData object from current state — shared by create & update */
  const buildFormData = () => {
    const formData = new FormData();
    formData.append("purpose", purpose);
    formData.append("propertyTypeTab", propertyTypeTab);
    formData.append("subtype", subtype);
    formData.append("city", city);
    formData.append("province", province);
    formData.append("location", location);
    formData.append("lat", String(lat));
    formData.append("lng", String(lng));
    formData.append("areaSize", areaSize);
    formData.append("areaUnit", areaUnit);
    formData.append("price", price);
    formData.append("currency", currency);
    formData.append("installment", String(installment));
    formData.append("readyForPossession", String(readyForPossession));
    if (bedrooms) formData.append("bedrooms", bedrooms);
    if (bathrooms) formData.append("bathrooms", bathrooms);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("contactEmail", contactEmail);
    if (landline) formData.append("landline", landline);
    formData.append("selectedAmenities", JSON.stringify(selectedAmenities));
    formData.append("videoLinks", JSON.stringify(videoLinks));
    const validMobiles = mobileNumbers.filter(
      (n): n is string => typeof n === "string" && n.trim().length > 0
    );
    formData.append("mobileNumbers", JSON.stringify(validMobiles));
    // Existing image URLs kept on the server
    formData.append("images", JSON.stringify(existingImageUrls));
    // Newly picked File objects
    images.forEach((img) => formData.append("images", img.file));
    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Prepare data for validation
    const validMobiles = mobileNumbers.filter(
      (n): n is string => typeof n === "string" && n.trim().length > 0
    );

    const formDataForValidation = {
      purpose,
      propertyTypeTab,
      subtype,
      city,
      province,
      location,
      lat,
      lng,
      areaSize,
      areaUnit,
      price,
      currency,
      installment,
      readyForPossession,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      selectedAmenities,
      title,
      description,
      contactEmail,
      mobileNumbers: validMobiles,
      landline: landline || null,
      images: [...existingImageUrls, ...images.map(img => img.file)], // File[] + string[]
      videoLinks,
    };

    // 2. Validate using Zod
    const validationResult = listingSchema.safeParse(formDataForValidation);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0].message;
      toast.error(firstError);
      return;
    }


    const toastId = toast.loading("Submitting your property listing...");

    try {
      await apiClient.post("/listings", buildFormData(), {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000, // 60 seconds for multi-image uploads
      });
      toast.update(toastId, { 
        render: "Listing published successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      router.push("/dashboard/property-listings");
    } catch (error: any) {
      console.error(error);
      toast.update(toastId, { 
        render: error?.message || "Failed to submit listing. Please check the form.", 
        type: "error", 
        isLoading: false, 
        autoClose: 5000 
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent, listingId: string) => {
    e.preventDefault();

    // 1. Prepare data for validation
    const validMobiles = mobileNumbers.filter(
      (n): n is string => typeof n === "string" && n.trim().length > 0
    );

    const formDataForValidation = {
      purpose,
      propertyTypeTab,
      subtype,
      city,
      province,
      location,
      lat,
      lng,
      areaSize,
      areaUnit,
      price,
      currency,
      installment,
      readyForPossession,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      selectedAmenities,
      title,
      description,
      contactEmail,
      mobileNumbers: validMobiles,
      landline: landline || null,
      images: [...existingImageUrls, ...images.map(img => img.file)], // Combine existing + new for validation count/size
      videoLinks,
    };

    // 2. Validate using Zod
    const validationResult = listingSchema.safeParse(formDataForValidation);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0].message;
      toast.error(firstError);
      return;
    }


    const toastId = toast.loading("Saving changes...");
    try {

      await apiClient.patch(`/listings/${listingId}`, buildFormData(), {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000, // 60 seconds for multi-image uploads
      });
      toast.update(toastId, { 
        render: "Listing updated successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
      router.push("/dashboard/property-listings");
    } catch (error: any) {
      console.error(error);
      toast.update(toastId, { 
        render: error?.message || "Failed to update listing. Please check the form.", 
        type: "error", 
        isLoading: false, 
        autoClose: 5000 
      });
    }
  };

  return {
    // State
    purpose, setPurpose,
    propertyTypeTab, setPropertyTypeTab,
    subtype, setSubtype,
    city, setCity,
    province, setProvince,
    location, setLocation,
    lat, setLat,
    lng, setLng,
    areaSize, setAreaSize,
    areaUnit, setAreaUnit,
    price, setPrice,
    currency, setCurrency,
    installment, setInstallment,
    readyForPossession, setReadyForPossession,
    bedrooms, setBedrooms,
    bathrooms, setBathrooms,
    selectedAmenities,
    showAmenitiesModal, setShowAmenitiesModal,
    title, setTitle,
    description, setDescription,
    existingImageUrls, setExistingImageUrls,
    images,
    videoLinks, videoInput, setVideoInput,
    contactEmail, setContactEmail,
    mobileNumbers,
    landline, setLandline,
    platformRPF, setPlatformRPF,
    fileInputRef,
    // Derived
    amenityScore, imageScore,
    // Handlers
    handleImageUpload, removeImage, reorderImages,
    toggleAmenity,
    addVideoLink, removeVideoLink,
    addMobileNumber, updateMobileNumber, removeMobileNumber,
    handleSubmit,
    handleUpdate,
  };
}
