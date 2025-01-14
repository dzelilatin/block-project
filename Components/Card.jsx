import React from "react";

const Card = ({ allcampaign, setOpenModel, setDonate, title }) => {
  console.log(allcampaign);

  const daysLeft = (deadline) => {
    if (!deadline) return "N/A"; // Fallback for missing deadline
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
    return remainingDays > 0 ? remainingDays.toFixed(0) : "Expired";
  };

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <p className="py-16 text-2xl font-bold leading-5">{title}</p>
      <div className="grid gap-5 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full">
        {allcampaign?.map((campaign, i) => (
          <div
            key={i + 1}
            onClick={() => (setDonate(campaign), setOpenModel(true))}
            className="cursor-pointer border overflow-hidden transition-shadow duration-300 bg-white rounded"
          >
            <img
              src="https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
              className="object-cover w-full h-64 rounded"
              alt="Campaign"
            />

            <div className="py-5 pl-2">
              <p className="mb-2 text-xs font-semibold text-gray-600 uppercase">
                Days Left: {daysLeft(campaign.deadline)}
              </p>
              <div className="mb-3 text-black">
                <p className="text-2xl font-bold leading-5">{campaign.title}</p>
              </div>
              <p className="mb-4 text-gray-700">{campaign.description}</p>
              <div className="flex space-x-4">
                <p className="font-semibold">Target: {campaign.target} ETH</p>
                <p className="font-semibold">
                  Raised: {campaign.amountCollected} ETH
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
