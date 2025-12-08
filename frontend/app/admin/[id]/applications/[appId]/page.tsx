"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApplicationDetailPage } from "@/app/admin/components/general/ApplicationDetailPage";
import { ConfirmationDialog } from "@/app/admin/components/general/confirmation-dialog";
import { useGetApplicationByIdQuery, useChangeApplicationStatusMutation } from "@/app/admin/redux/services/appApi";
import { useAppSelector } from "@/app/admin/redux/hooks";
import type { CompanyDocument } from "@/app/admin/types";

export default function ApplicationDetails() {
  const router = useRouter();
  const params = useParams();

  const { initialized, user } = useAppSelector((state) => state.auth);

  const appIdParam = (params as { appId?: string | string[] }).appId;
  const applicationId = Array.isArray(appIdParam) ? appIdParam[0] : appIdParam || "";

  const shouldSkipQuery = !applicationId || !initialized;

  const { data: application, isLoading, isFetching, refetch } = useGetApplicationByIdQuery(applicationId, {
    skip: shouldSkipQuery,
  });
                console.log("application:", application)

  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
  const [isForwardSuccessDialogOpen, setIsForwardSuccessDialogOpen] = useState(false);
  const [isForwardErrorDialogOpen, setIsForwardErrorDialogOpen] = useState(false);

  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isApproveSuccessDialogOpen, setIsApproveSuccessDialogOpen] = useState(false);
  const [isApproveErrorDialogOpen, setIsApproveErrorDialogOpen] = useState(false);

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isRejectSuccessDialogOpen, setIsRejectSuccessDialogOpen] = useState(false);
  const [isRejectErrorDialogOpen, setIsRejectErrorDialogOpen] = useState(false);

  const [changeApplicationStatus, { isLoading: isChangingStatus }] = useChangeApplicationStatusMutation();

  const companyData = application?.companyId;
  const documents = (typeof companyData === 'object' && companyData !== null) ? companyData.documents ?? [] : [];

  const hasUnapprovedDocuments =
    documents.length > 0 &&
    documents.some((doc: CompanyDocument) => {
      const rawStatus = doc?.status;
      const statusValue = rawStatus?.status ?? "";
      return statusValue.toLowerCase() !== "approved";
    });

  const isForwardDisabled =
    application?.currentStatus !== "Pending Desk Review" || hasUnapprovedDocuments;
  const isRegistrar = user?.role === "Registrar";

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center text-lg rounded-2xl custom-green p-4 text-white font-bold hover:text-gray-900"
          >
            <span className="mr-1">&larr;</span>
            Back
          </button>

          {!isFetching && isRegistrar && application?.currentStatus !== 'Approved' ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-green-600 hover:bg-green-800 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => {
                  setIsApproveDialogOpen(true);
                }}
                disabled={!applicationId}
              >
                Approve application
              </button>
              {application?.currentStatus !== 'Rejected' && (
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-red-600 hover:bg-red-800 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => {
                    setIsRejectDialogOpen(true);
                  }}
                  disabled={!applicationId}
                >
                  Reject application
                </button>
              )}
            </div>
          ) : !isFetching && !isRegistrar ? (
            <button
              type="button"
              className={`inline-flex items-center rounded-md ${isForwardDisabled ? "bg-blue-200 hover:bg-blue-200" : 'bg-blue-600 hover:bg-blue-800'} px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              onClick={() => {
                setIsForwardDialogOpen(true);
              }}
              disabled={isForwardDisabled}
            >
              Forward to registrar
            </button>
          ) : null}
          <ConfirmationDialog
            isOpen={isForwardDialogOpen}
            onClose={() => setIsForwardDialogOpen(false)}
            onConfirm={async () => {
              if (!applicationId) return;
              try {
                await changeApplicationStatus({
                  applicationId,
                  applicationStatus: "Forwarded to Registrar",
                }).unwrap();
                setIsForwardDialogOpen(false);
                setIsForwardSuccessDialogOpen(true);
              } catch (error) {
                console.error("Failed to forward to registrar", error);
                setIsForwardDialogOpen(false);
                setIsForwardErrorDialogOpen(true);
              }
            }}
            title="Forward to registrar"
            description="Do you want to forward this application to the registrar?"
            confirmText="Yes, forward"
            cancelText="Cancel"
            loading={isChangingStatus}
          />
          <ConfirmationDialog
            isOpen={isForwardSuccessDialogOpen}
            onClose={() => setIsForwardSuccessDialogOpen(false)}
            onConfirm={() => setIsForwardSuccessDialogOpen(false)}
            title="Application forwarded"
            description="The application has been successfully forwarded to the registrar."
            confirmText="OK"
            cancelText="Close"
          />
          <ConfirmationDialog
            isOpen={isForwardErrorDialogOpen}
            onClose={() => setIsForwardErrorDialogOpen(false)}
            onConfirm={() => setIsForwardErrorDialogOpen(false)}
            title="Forwarding failed"
            description="There was a problem forwarding this application. Please try again."
            confirmText="OK"
            cancelText="Close"
            variant="destructive"
          />
          <ConfirmationDialog
            isOpen={isApproveDialogOpen}
            onClose={() => setIsApproveDialogOpen(false)}
            onConfirm={async () => {
              if (!applicationId) return;
              try {
                await changeApplicationStatus({
                  applicationId,
                  applicationStatus: "Approved",
                }).unwrap();
                setIsApproveDialogOpen(false);
                setIsApproveSuccessDialogOpen(true);
              } catch (error) {
                console.error("Failed to approve application", error);
                setIsApproveDialogOpen(false);
                setIsApproveErrorDialogOpen(true);
              }
            }}
            title="Approve application"
            description="Do you want to approve this application?"
            confirmText="Yes, approve"
            cancelText="Cancel"
            loading={isChangingStatus}
          />
          <ConfirmationDialog
            isOpen={isApproveSuccessDialogOpen}
            onClose={() => setIsApproveSuccessDialogOpen(false)}
            onConfirm={() => setIsApproveSuccessDialogOpen(false)}
            title="Application approved"
            description="The application has been successfully approved."
            confirmText="OK"
            cancelText="Close"
          />
          <ConfirmationDialog
            isOpen={isApproveErrorDialogOpen}
            onClose={() => setIsApproveErrorDialogOpen(false)}
            onConfirm={() => setIsApproveErrorDialogOpen(false)}
            title="Approval failed"
            description="There was a problem approving this application. Please try again."
            confirmText="OK"
            cancelText="Close"
            variant="destructive"
          />
          <ConfirmationDialog
            isOpen={isRejectDialogOpen}
            onClose={() => setIsRejectDialogOpen(false)}
            onConfirm={async () => {
              if (!applicationId) return;
              try {
                await changeApplicationStatus({
                  applicationId,
                  applicationStatus: "Rejected",
                }).unwrap();
                setIsRejectDialogOpen(false);
                setIsRejectSuccessDialogOpen(true);
              } catch (error) {
                console.error("Failed to reject application", error);
                setIsRejectDialogOpen(false);
                setIsRejectErrorDialogOpen(true);
              }
            }}
            title="Reject application"
            description="Do you want to reject this application?"
            confirmText="Yes, reject"
            cancelText="Cancel"
            loading={isChangingStatus}
          />
          <ConfirmationDialog
            isOpen={isRejectSuccessDialogOpen}
            onClose={() => setIsRejectSuccessDialogOpen(false)}
            onConfirm={() => setIsRejectSuccessDialogOpen(false)}
            title="Application rejected"
            description="The application has been rejected."
            confirmText="OK"
            cancelText="Close"
          />
          <ConfirmationDialog
            isOpen={isRejectErrorDialogOpen}
            onClose={() => setIsRejectErrorDialogOpen(false)}
            onConfirm={() => setIsRejectErrorDialogOpen(false)}
            title="Rejection failed"
            description="There was a problem rejecting this application. Please try again."
            confirmText="OK"
            cancelText="Close"
            variant="destructive"
          />
        </div>

        {shouldSkipQuery || isLoading || isFetching || !application ? (
          <div className="flex justify-center items-center h-64">
            <span className="loader"></span>
          </div>
        ) : (
          <ApplicationDetailPage
            applicationId={application._id}
            contractorName={application.name}
            rcNumber={application.rcNumber}
            sectorAndGrade={`${application.sector} ${application.grade}`}
            submissionDate={application.submissionDate}
            slaDeadline={undefined}
            assignedTo={application.assignedTo}
            currentStatus={application.currentStatus}
            showBackButton={false}
            allowDeskOfficerAssignment={false}
            documents={documents}
            company={typeof application.companyId === 'object' ? application.companyId : undefined}
            onDocumentsUpdated={refetch}
          />
        )}
      </div>
    </main>
  );
}