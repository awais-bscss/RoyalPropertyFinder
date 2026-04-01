"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "@/lib/axios";

import {
  usePostListingForm,
  ListingInitialData,
} from "@/components/dashboard/post-listing/hooks/usePostListingForm";
import { LocationSection } from "@/components/dashboard/post-listing/components/sections/LocationSection";
import { PriceAreaSection } from "@/components/dashboard/post-listing/components/sections/PriceAreaSection";
import { FeaturesSection } from "@/components/dashboard/post-listing/components/sections/FeaturesSection";
import { AdInfoSection } from "@/components/dashboard/post-listing/components/sections/AdInfoSection";
import { ImagesSection } from "@/components/dashboard/post-listing/components/sections/ImagesSection";
import { ContactSection } from "@/components/dashboard/post-listing/components/sections/ContactSection";
import { PlatformSection } from "@/components/dashboard/post-listing/components/sections/PlatformSection";
import { AmenitiesModal } from "@/components/dashboard/post-listing/components/AmenitiesModal";

// ── Inner form (rendered only once initialData is ready) ─────────────────────
function EditForm({
  listingId,
  initialData,
}: {
  listingId: string;
  initialData: ListingInitialData;
}) {
  const form = usePostListingForm(initialData);

  return (
    <div>
      {/* Form */}
      <form
        onSubmit={(e) => form.handleUpdate(e, listingId)}
        className="space-y-6"
      >
        <LocationSection
          purpose={form.purpose}
          setPurpose={form.setPurpose}
          propertyTypeTab={form.propertyTypeTab}
          setPropertyTypeTab={form.setPropertyTypeTab}
          subtype={form.subtype}
          setSubtype={form.setSubtype}
          city={form.city}
          setCity={form.setCity}
          province={form.province}
          setProvince={form.setProvince}
          location={form.location}
          setLocation={form.setLocation}
          lat={form.lat}
          setLat={form.setLat}
          lng={form.lng}
          setLng={form.setLng}
        />

        <PriceAreaSection
          areaSize={form.areaSize}
          setAreaSize={form.setAreaSize}
          areaUnit={form.areaUnit}
          setAreaUnit={form.setAreaUnit}
          price={form.price}
          setPrice={form.setPrice}
          currency={form.currency}
          setCurrency={form.setCurrency}
          installment={form.installment}
          setInstallment={form.setInstallment}
          readyForPossession={form.readyForPossession}
          setReadyForPossession={form.setReadyForPossession}
        />

        <FeaturesSection
          bedrooms={form.bedrooms}
          setBedrooms={form.setBedrooms}
          bathrooms={form.bathrooms}
          setBathrooms={form.setBathrooms}
          selectedAmenities={form.selectedAmenities}
          amenityScore={form.amenityScore}
          toggleAmenity={form.toggleAmenity}
          setShowAmenitiesModal={form.setShowAmenitiesModal}
        />

        <AdInfoSection
          title={form.title}
          setTitle={form.setTitle}
          description={form.description}
          setDescription={form.setDescription}
        />

        <ImagesSection
          images={form.images}
          coverIdx={form.coverIdx}
          setCoverIdx={form.setCoverIdx}
          handleImageUpload={form.handleImageUpload}
          removeImage={form.removeImage}
          fileInputRef={form.fileInputRef}
          imageScore={form.imageScore}
          videoLinks={form.videoLinks}
          videoInput={form.videoInput}
          setVideoInput={form.setVideoInput}
          addVideoLink={form.addVideoLink}
          removeVideoLink={form.removeVideoLink}
        />

        <ContactSection
          contactEmail={form.contactEmail}
          setContactEmail={form.setContactEmail}
          mobileNumbers={form.mobileNumbers}
          addMobileNumber={form.addMobileNumber}
          updateMobileNumber={form.updateMobileNumber}
          removeMobileNumber={form.removeMobileNumber}
          landline={form.landline}
          setLandline={form.setLandline}
        />

        <PlatformSection
          platformRPF={form.platformRPF}
          setPlatformRPF={form.setPlatformRPF}
        />

        {/* Submit */}
        <div className="flex justify-end pt-4 pb-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-royal-800 hover:bg-royal-700 text-white font-bold rounded-xl text-[15px] transition-colors cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>

      <AmenitiesModal
        isOpen={form.showAmenitiesModal}
        onClose={() => form.setShowAmenitiesModal(false)}
        selectedAmenities={form.selectedAmenities}
        toggleAmenity={form.toggleAmenity}
      />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [initialData, setInitialData] = useState<ListingInitialData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res: any = await apiClient.get(`/listings/${id}`);
        const l = res.data;

        setInitialData({
          purpose: l.purpose,
          propertyTypeTab: l.propertyTypeTab,
          subtype: l.subtype,
          city: l.city,
          province: l.province,
          location: l.location,
          lat: l.lat,
          lng: l.lng,
          areaSize: String(l.areaSize),
          areaUnit: l.areaUnit,
          price: String(l.price),
          currency: l.currency,
          installment: l.installment,
          readyForPossession: l.readyForPossession,
          bedrooms: l.bedrooms ?? "",
          bathrooms: l.bathrooms ?? "",
          selectedAmenities: l.selectedAmenities ?? [],
          title: l.title,
          description: l.description,
          images: l.images ?? [],
          videoLinks: l.videoLinks ?? [],
          contactEmail: l.contactEmail,
          mobileNumbers: l.mobileNumbers ?? [],
          landline: l.landline ?? "",
        });
      } catch (err) {
        toast.error("Could not load listing. Please try again.");
        router.push("/dashboard/property-listings");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id, router]);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/property-listings")}
          className="flex items-center gap-1.5 text-[14px] font-medium text-slate-500 hover:text-royal-600 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Listings
        </button>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-1.5">
          Edit Listing
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Update the details below to modify your property listing.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-royal-600" />
        </div>
      ) : initialData ? (
        <EditForm listingId={id} initialData={initialData} />
      ) : null}
    </div>
  );
}
