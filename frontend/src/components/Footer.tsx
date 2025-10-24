import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Về chúng tôi', href: '/about' },
      { name: 'Tin tức', href: '/news' },
      { name: 'Tuyển dụng', href: '/careers' },
      { name: 'Liên hệ', href: '/contact' },
    ],
    support: [
      { name: 'Trung tâm hỗ trợ', href: '/support' },
      { name: 'Câu hỏi thường gặp', href: '/faq' },
      { name: 'Hướng dẫn đặt tour', href: '/guide' },
      { name: 'Chính sách hủy', href: '/cancellation' },
    ],
    legal: [
      { name: 'Điều khoản sử dụng', href: '/terms' },
      { name: 'Chính sách bảo mật', href: '/privacy' },
      { name: 'Chính sách cookie', href: '/cookies' },
      { name: 'Bảo hiểm du lịch', href: '/insurance' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'facebook' },
    { name: 'Instagram', href: '#', icon: 'instagram' },
    { name: 'Twitter', href: '#', icon: 'twitter' },
    { name: 'YouTube', href: '#', icon: 'youtube' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <MapPinIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Smart Tour</span>
                <div className="text-xs text-gray-400 -mt-1">Travel Management</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-sm">
              Khám phá thế giới với những trải nghiệm du lịch tuyệt vời. 
              Chúng tôi cam kết mang đến cho bạn những chuyến đi đáng nhớ nhất.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <PhoneIcon className="h-4 w-4 mr-3 text-primary-400" />
                <span className="text-sm">+84 123 456 789</span>
              </div>
              <div className="flex items-center text-gray-300">
                <EnvelopeIcon className="h-4 w-4 mr-3 text-primary-400" />
                <span className="text-sm">info@smarttour.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <GlobeAltIcon className="h-4 w-4 mr-3 text-primary-400" />
                <span className="text-sm">www.smarttour.com</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Công ty</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pháp lý</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Đăng ký nhận tin</h3>
            <p className="text-gray-300 text-sm mb-4">
              Nhận thông tin về các tour mới và ưu đãi đặc biệt
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Smart Tour. Tất cả quyền được bảo lưu.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-2">Theo dõi chúng tôi:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={social.name}
                >
                  <span className="sr-only">{social.name}</span>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="text-xs font-semibold">
                      {social.icon === 'facebook' ? 'f' : 
                       social.icon === 'instagram' ? 'ig' :
                       social.icon === 'twitter' ? 't' : 'yt'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-wrap justify-center items-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <HeartIcon className="h-4 w-4 mr-1 text-red-500" />
                <span>Được tin tưởng bởi 10,000+ khách hàng</span>
              </div>
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1 text-green-500" />
                <span>Hỗ trợ 24/7</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1 text-blue-500" />
                <span>50+ điểm đến</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;