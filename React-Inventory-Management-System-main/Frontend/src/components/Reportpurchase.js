import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChartBarIcon, CalendarIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PurchaseReports({ products, authContext }) {
  const [reportType, setReportType] = useState("weekly");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Set default date ranges based on report type
    const today = new Date();
    switch (reportType) {
      case "weekly":
        setStartDate(new Date(today.setDate(today.getDate() - 7)));
        setEndDate(new Date());
        break;
      case "monthly":
        setStartDate(new Date(today.getFullYear(), today.getMonth(), 1));
        setEndDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
        break;
      case "yearly":
        setStartDate(new Date(today.getFullYear(), 0, 1));
        setEndDate(new Date(today.getFullYear(), 11, 31));
        break;
      default:
        break;
    }
  }, [reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/purchase/report?type=${reportType}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "weekly":
        return `Weekly Purchase Report (${formatDate(startDate)} - ${formatDate(endDate)})`;
      case "monthly":
        return `Monthly Purchase Report (${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()})`;
      case "yearly":
        return `Yearly Purchase Report (${startDate.getFullYear()})`;
      default:
        return "Purchase Report";
    }
  };

  const getChartData = () => {
    if (!reportData || reportData.length === 0) return [];

    if (reportType === "weekly") {
      return reportData.map(item => ({
        name: formatDate(new Date(item._id)),
        total: item.totalAmount,
        count: item.count
      }));
    } else if (reportType === "monthly") {
      return reportData.map(item => ({
        name: `Week ${item._id}`,
        total: item.totalAmount,
        count: item.count
      }));
    } else {
      return reportData.map(item => ({
        name: new Date(0, item._id - 1).toLocaleString('default', { month: 'short' }),
        total: item.totalAmount,
        count: item.count
      }));
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ChartBarIcon className="-ml-1 mr-2 h-5 w-5" />
        Generate Purchase Report
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <DocumentTextIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Purchase Reports
                        </Dialog.Title>
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Report Type</label>
                              <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                              >
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">Start Date</label>
                              <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">End Date</label>
                              <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                              />
                            </div>
                          </div>

                          <button
                            onClick={fetchReportData}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            {loading ? "Generating..." : "Generate Report"}
                          </button>

                          {reportData.length > 0 && (
                            <div className="mt-6">
                              <h4 className="text-lg font-medium text-gray-900 mb-4">{getReportTitle()}</h4>
                              
                              <div className="h-80 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={getChartData()}
                                    margin={{
                                      top: 5,
                                      right: 30,
                                      left: 20,
                                      bottom: 5,
                                    }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total" fill="#8884d8" name="Total Amount" />
                                    <Bar dataKey="count" fill="#82ca9d" name="Purchase Count" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {reportType === "weekly" ? "Date" : reportType === "monthly" ? "Week" : "Month"}
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Purchases
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Amount
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map((item, idx) => (
                                      <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {reportType === "weekly" 
                                            ? formatDate(new Date(item._id)) 
                                            : reportType === "monthly" 
                                              ? `Week ${item._id}` 
                                              : new Date(0, item._id - 1).toLocaleString('default', { month: 'long' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {item.count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          Rs. {item.totalAmount.toFixed(2)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}