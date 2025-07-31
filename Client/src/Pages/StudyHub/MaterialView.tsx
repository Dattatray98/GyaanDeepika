// MaterialView.tsx

import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function MaterialView() {
    const { pdfUrl } = useParams<{ pdfUrl: string }>();
    const navigate = useNavigate();
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const decodedPdfUrl = decodeURIComponent(pdfUrl || '');

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setIsLoading(false);
    }

    function onDocumentLoadError(error: Error) {
        console.error('PDF load error:', error);
        setError('Failed to load PDF. Please try again later.');
        setIsLoading(false);
    }

    const getFileIdFromDriveUrl = (url: string) => {
        return (
            url.match(/\/file\/d\/([^\/]+)/)?.[1] ||
            url.match(/id=([^&]+)/)?.[1] ||
            url.split('/').pop()
        );
    };

    const isGoogleDriveUrl = decodedPdfUrl.includes('drive.google.com');
    const fileId = isGoogleDriveUrl ? getFileIdFromDriveUrl(decodedPdfUrl) : null;

    const downloadUrl = isGoogleDriveUrl
        ? `https://drive.google.com/uc?export=download&id=${fileId}`
        : decodedPdfUrl;

    const previewUrl = isGoogleDriveUrl
        ? `https://drive.google.com/file/d/${fileId}/preview`
        : null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        link.download = 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-4">
                        {numPages && !isGoogleDriveUrl && (
                            <div className="text-sm text-gray-600">
                                Page {pageNumber} of {numPages}
                            </div>
                        )}

                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            <span>Download</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Viewer */}
            <main className="flex-1 p-4 overflow-auto">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4">
                    {error ? (
                        <div className="text-center py-12 text-red-500">{error}</div>
                    ) : isGoogleDriveUrl ? (
                        <div className="aspect-video">
                            <iframe
                                src={previewUrl || ''}
                                width="100%"
                                height="700px"
                                allow="autoplay"
                                className="rounded"
                                title="Google Drive PDF Preview"
                            ></iframe>
                        </div>
                    ) : (
                        <>
                            {isLoading && (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                                    <span className="ml-2">Loading PDF...</span>
                                </div>
                            )}

                            <div className="flex justify-center">
                                <Document
                                    file={decodedPdfUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                    loading={
                                        <div className="flex justify-center items-center h-64">
                                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                        </div>
                                    }
                                    noData={
                                        <div className="text-center py-12 text-gray-500">
                                            PDF could not be loaded
                                        </div>
                                    }
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        width={800}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>
                            </div>

                            {numPages && numPages > 1 && (
                                <div className="flex justify-center mt-4 gap-4">
                                    <button
                                        disabled={pageNumber <= 1}
                                        onClick={() => setPageNumber((prev) => prev - 1)}
                                        className={`px-4 py-2 rounded-md border ${pageNumber <= 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    <button
                                        disabled={pageNumber >= numPages}
                                        onClick={() => setPageNumber((prev) => prev + 1)}
                                        className={`px-4 py-2 rounded-md border ${pageNumber >= numPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default MaterialView;
