import { useState } from "react";
import { Panjar } from "../../../types/panjar";
import PanjarItemsTable from "./PanjarItemsTable";
import PanjarRealizationItemsTable from "./PanjarRealizationItemsTable";

interface PanjarItemsTableTabProps {

  panjarData: Panjar;
  canVerify: boolean;
  canApprove: boolean;
  refetch: () => void;
  panjarRequestId: string;
  setIsAddPanjarItemModalOpen: (isOpen: boolean) => void;
  canCreate: boolean;
  onEditItem?: (item: any) => void;
}

export interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface TabButtonProps extends TabData {
  isActive: boolean;
  onClick: () => void;
  panjarData: Panjar;
  canVerify: boolean;
  canApprove: boolean;
  refetch: () => void;
  setIsAddPanjarItemModalOpen: (isOpen: boolean) => void;
  canCreate: boolean;
  onEditItem?: (item: any) => void;
}
// Example SVG Icons
const OverviewIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.83203 2.5835C3.58939 2.5835 2.58203 3.59085 2.58203 4.83349V7.25015C2.58203 8.49279 3.58939 9.50015 4.83203 9.50015H7.2487C8.49134 9.50015 9.4987 8.49279 9.4987 7.25015V4.8335C9.4987 3.59086 8.49134 2.5835 7.2487 2.5835H4.83203ZM4.08203 4.83349C4.08203 4.41928 4.41782 4.0835 4.83203 4.0835H7.2487C7.66291 4.0835 7.9987 4.41928 7.9987 4.8335V7.25015C7.9987 7.66436 7.66291 8.00015 7.2487 8.00015H4.83203C4.41782 8.00015 4.08203 7.66436 4.08203 7.25015V4.83349ZM4.83203 10.5002C3.58939 10.5002 2.58203 11.5075 2.58203 12.7502V15.1668C2.58203 16.4095 3.58939 17.4168 4.83203 17.4168H7.2487C8.49134 17.4168 9.4987 16.4095 9.4987 15.1668V12.7502C9.4987 11.5075 8.49134 10.5002 7.2487 10.5002H4.83203ZM4.08203 12.7502C4.08203 12.336 4.41782 12.0002 4.83203 12.0002H7.2487C7.66291 12.0002 7.9987 12.336 7.9987 12.7502V15.1668C7.9987 15.5811 7.66291 15.9168 7.2487 15.9168H4.83203C4.41782 15.9168 4.08203 15.5811 4.08203 15.1668V12.7502ZM10.4987 4.83349C10.4987 3.59085 11.5061 2.5835 12.7487 2.5835H15.1654C16.408 2.5835 17.4154 3.59086 17.4154 4.8335V7.25015C17.4154 8.49279 16.408 9.50015 15.1654 9.50015H12.7487C11.5061 9.50015 10.4987 8.49279 10.4987 7.25015V4.83349ZM12.7487 4.0835C12.3345 4.0835 11.9987 4.41928 11.9987 4.83349V7.25015C11.9987 7.66436 12.3345 8.00015 12.7487 8.00015H15.1654C15.5796 8.00015 15.9154 7.66436 15.9154 7.25015V4.8335C15.9154 4.41928 15.5796 4.0835 15.1654 4.0835H12.7487ZM12.7487 10.5002C11.5061 10.5002 10.4987 11.5075 10.4987 12.7502V15.1668C10.4987 16.4095 11.5061 17.4168 12.7487 17.4168H15.1654C16.408 17.4168 17.4154 16.4095 17.4154 15.1668V12.7502C17.4154 11.5075 16.408 10.5002 15.1654 10.5002H12.7487ZM11.9987 12.7502C11.9987 12.336 12.3345 12.0002 12.7487 12.0002H15.1654C15.5796 12.0002 15.9154 12.336 15.9154 12.7502V15.1668C15.9154 15.5811 15.5796 15.9168 15.1654 15.9168H12.7487C12.3345 15.9168 11.9987 15.5811 11.9987 15.1668V12.7502Z"
      fill="currentColor"
    />
  </svg>
);

const NotificationIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.7487 2.29248C10.7487 1.87827 10.4129 1.54248 9.9987 1.54248C9.58448 1.54248 9.2487 1.87827 9.2487 2.29248V2.83613C6.08132 3.20733 3.6237 5.9004 3.6237 9.16748V14.4591H3.33203C2.91782 14.4591 2.58203 14.7949 2.58203 15.2091C2.58203 15.6234 2.91782 15.9591 3.33203 15.9591H4.3737H15.6237H16.6654C17.0796 15.9591 17.4154 15.6234 17.4154 15.2091C17.4154 14.7949 17.0796 14.4591 16.6654 14.4591H16.3737V9.16748C16.3737 5.9004 13.9161 3.20733 10.7487 2.83613V2.29248ZM14.8737 14.4591V9.16748C14.8737 6.47509 12.6911 4.29248 9.9987 4.29248C7.30631 4.29248 5.1237 6.47509 5.1237 9.16748V14.4591H14.8737ZM7.9987 17.7085C7.9987 18.1228 8.33448 18.4585 8.7487 18.4585H11.2487C11.6629 18.4585 11.9987 18.1228 11.9987 17.7085C11.9987 17.2943 11.6629 16.9585 11.2487 16.9585H8.7487C8.33448 16.9585 7.9987 17.2943 7.9987 17.7085Z"
      fill="currentColor"
    />
  </svg>
);



const TabButton: React.FC<TabButtonProps> = ({
  label,
  icon,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={`inline-flex items-center gap-2 border-b-2 px-2.5 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "text-brand-500 border-brand-500 dark:text-brand-400 dark:border-brand-400"
          : "text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
};

interface TabContentProps {
  content: React.ReactNode;
  isActive: boolean;
}

const TabContent: React.FC<TabContentProps> = ({ content, isActive }) => {
  if (!isActive) return null;

  return (
    <div>
      {content}
    </div>
  );
};

export default function PanjarItemsTableTab({
  panjarData,
  canVerify,
  canApprove,
  panjarRequestId,
  refetch,
  setIsAddPanjarItemModalOpen,
  canCreate,
  onEditItem    
}: PanjarItemsTableTabProps) {
  const [activeTab, setActiveTab] = useState<TabData["id"]>("panjar_items");
  const tabData: TabData[] = [
    {
      id: "panjar_items",
      label: "Item Panjar",
      icon: <OverviewIcon />,
      content:
        <PanjarItemsTable
          panjarData={panjarData}
          canVerify={canVerify}
          canApprove={canApprove}
          refetch={refetch}
          setIsAddPanjarItemModalOpen={setIsAddPanjarItemModalOpen}
          canCreate={canCreate}
          onEditItem={onEditItem}
        />,
    },
    {
      id: "realization_items",
      label: "Realisasi Item",
      icon: <NotificationIcon />,
      content:
        <PanjarRealizationItemsTable panjarRequestId={panjarRequestId}/>,
    },
  ];

  return (
    <div className="p-6 border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          {tabData.map((tab) => (
            <TabButton
              key={tab.id}
              {...tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              panjarData={panjarData}
              canVerify={canVerify}
              canApprove={canApprove}
              refetch={refetch}
              setIsAddPanjarItemModalOpen={setIsAddPanjarItemModalOpen}
              canCreate={canCreate}
              onEditItem={onEditItem}
            />
          ))}
        </nav>
      </div>

      <div className="pt-4">
        {tabData.map((tab) => (
          <TabContent
            key={tab.id}
            content={tab.content}
            isActive={activeTab === tab.id}
          />
        ))}
      </div>
    </div>
  );
}
