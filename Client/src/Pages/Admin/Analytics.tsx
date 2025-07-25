import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const Analytics: React.FC = () => {
  const metrics = [
    {
      title: 'Total Pageviews',
      value: '142,350',
      change: '+12.5%',
      changeType: 'positive',
      period: 'vs last month'
    },
    {
      title: 'Unique Visitors',
      value: '89,240',
      change: '+8.2%',
      changeType: 'positive',
      period: 'vs last month'
    },
    {
      title: 'Avg. Session Duration',
      value: '4m 32s',
      change: '-2.1%',
      changeType: 'negative',
      period: 'vs last month'
    },
    {
      title: 'Bounce Rate',
      value: '34.2%',
      change: '-5.3%',
      changeType: 'positive',
      period: 'vs last month'
    }
  ];

  const deviceStats = [
    { device: 'Desktop', percentage: 65, count: '58,106', icon: Monitor, color: 'bg-blue-500' },
    { device: 'Mobile', percentage: 28, count: '24,987', icon: Smartphone, color: 'bg-emerald-500' },
    { device: 'Tablet', percentage: 7, count: '6,247', icon: Tablet, color: 'bg-purple-500' }
  ];

  const topPages = [
    { page: '/courses/react-fundamentals', views: 15420, title: 'React Fundamentals Course' },
    { page: '/courses/python-data-science', views: 12350, title: 'Python for Data Science' },
    { page: '/articles/ai-education', views: 8760, title: 'AI in Education Article' },
    { page: '/courses/digital-marketing', views: 7890, title: 'Digital Marketing Mastery' },
    { page: '/blog/career-guidance', views: 6540, title: 'Career Guidance Blog' }
  ];

  const trafficSources = [
    { source: 'Organic Search', percentage: 45, visitors: '40,158' },
    { source: 'Direct', percentage: 28, visitors: '24,987' },
    { source: 'Social Media', percentage: 15, visitors: '13,386' },
    { source: 'Referral', percentage: 8, visitors: '7,139' },
    { source: 'Email', percentage: 4, visitors: '3,570' }
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your website performance and user engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              {metric.changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="mb-2">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <span className={`font-medium ${
                metric.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">{metric.period}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Traffic Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Traffic Overview</h2>
          <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">Interactive Traffic Chart</p>
              <p className="text-xs sm:text-sm text-gray-500">Real chart would be integrated here</p>
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Device Breakdown</h2>
          <div className="space-y-4">
            {deviceStats.map((device, index) => {
              const Icon = device.icon;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`p-2 ${device.color} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-700">{device.device}</span>
                      <span className="text-xs sm:text-sm text-gray-600">{device.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${device.color}`}
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{device.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Top Pages</h2>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">{page.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{page.page}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm sm:text-base">{page.views.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full" style={{ 
                  backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                }}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">{source.source}</span>
                    <span className="text-xs sm:text-sm text-gray-600">{source.visitors}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${source.percentage}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Real-time Activity</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-emerald-600">127</p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-blue-600">34</p>
            <p className="text-sm text-gray-600">Countries</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-xl sm:text-2xl font-bold text-purple-600">5m 23s</p>
            <p className="text-sm text-gray-600">Avg. Session</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;