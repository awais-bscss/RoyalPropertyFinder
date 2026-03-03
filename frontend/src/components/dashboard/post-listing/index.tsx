"use client";

import { Send, ShieldCheck } from "lucide-react";

import { usePostListingForm } from "@/components/dashboard/post-listing/hooks/usePostListingForm";
import { LocationSection } from "@/components/dashboard/post-listing/components/sections/LocationSection";
import { PriceAreaSection } from "@/components/dashboard/post-listing/components/sections/PriceAreaSection";
import { FeaturesSection } from "@/components/dashboard/post-listing/components/sections/FeaturesSection";
import { AdInfoSection } from "@/components/dashboard/post-listing/components/sections/AdInfoSection";
import { ImagesSection } from "@/components/dashboard/post-listing/components/sections/ImagesSection";
import { ContactSection } from "@/components/dashboard/post-listing/components/sections/ContactSection";
import { PlatformSection } from "@/components/dashboard/post-listing/components/sections/PlatformSection";
import { AmenitiesModal } from "@/components/dashboard/post-listing/components/AmenitiesModal";

export function PostListing() {
  const form = usePostListingForm();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-1.5">
          Post a New Listing
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Fill in the details below to advertise your property.
        </p>
      </div>

      {/* Full-width form — no max-w cap */}
      <form onSubmit={form.handleSubmit} className="space-y-6">
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

        {/* ── Submit Button ── */}
        <div className="flex justify-end pt-4 pb-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-royal-800 hover:bg-royal-700 text-white font-bold rounded-xl text-[15px] transition-colors cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
            Submit Listing
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
