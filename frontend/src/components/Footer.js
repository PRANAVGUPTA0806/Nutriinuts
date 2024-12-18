import React,{useState,useEffect} from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";

function Footer() {

  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/offers/offers`); // Fetch all offers
        const data = await response.json();
        if (data.length > 0) {
          // Pick one random offer from the list
          const randomOffer = data[Math.floor(Math.random() * data.length)];
          setOffer(randomOffer);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffer();
  }, []);
  return (
    <div className="footerMainContainer">
      <div className="firstFrameContainer">
        <div className="footerLeftContainer">
          <span>
            <b>YOU'VE HIT ROCK BOTTOM!</b>
          </span>
          <br />
          <span>
            You've been doing some scrolling - so here's a reward for that
            overworked thumb. {offer ? (
          <span className="firstSpan">
            Get Rs.{offer.dis}/- off by Discount using code "{offer.discountCode}" valid till {new Date(offer.validTill).toLocaleDateString()}
          </span>
        ) : (
          <span>Loading offers...</span>
        )} Apply
            it on checkout. Don't wait! Complete the order - you can thank us
            later dumdum.
          </span>
        </div>
        <div className="footerRightContainer">
          <ul>
            <Link to="/aboutus">
              <li>About Us</li>
            </Link>
            <Link to="/privacypolicy">
              <li>Privacy Policy</li>
            </Link>
            <Link to="/TermsAndConditions"><li>Terms of Service</li></Link>
            <Link to="/ReturnAndRefundPolicy">
  <li>Refund And Shipping Policy</li>
</Link>

            
          </ul>
        </div>
      </div>
      <div className="secondFrameContainer">
        <div className="copyrightFrameContainer">
          <span>© 2024 NutriiNuts™. All Rights Reserved. </span>
        </div>
        <div className="followIconContainer">
          <div className="followIconTextContainer">
            <span>Follow Us</span>
          </div>
          <div className="followIconSvgContainer">
            {/* Facebook Icon  */}
            <a
              href="https://www.facebook.com/profile.php?id=61558080473930&mibextid=uzlsIk"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" opacity=".35"></circle>
                <path d="M10.505,10.272v1.749H8.031v2.629h2.474v7.226C10.994,21.95,11.491,22,12,22c0.46,0,0.91-0.042,1.354-0.102V14.65h2.588	l0.406-2.629h-2.995v-1.437c0-1.092,0.357-2.061,1.379-2.061h1.642V6.229c-0.289-0.039-0.898-0.124-2.051-0.124	C11.916,6.105,10.505,7.376,10.505,10.272z"></path>
              </svg>
            </a>
            {/* Twitter Icon  */}
            <a
              href="https://x.com/nutriinuts?s=11"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 26 26"
              >
                <path d="M 25.855469 5.574219 C 24.914063 5.992188 23.902344 6.273438 22.839844 6.402344 C 23.921875 5.75 24.757813 4.722656 25.148438 3.496094 C 24.132813 4.097656 23.007813 4.535156 21.8125 4.769531 C 20.855469 3.75 19.492188 3.113281 17.980469 3.113281 C 15.082031 3.113281 12.730469 5.464844 12.730469 8.363281 C 12.730469 8.773438 12.777344 9.175781 12.867188 9.558594 C 8.503906 9.339844 4.636719 7.246094 2.046875 4.070313 C 1.59375 4.847656 1.335938 5.75 1.335938 6.714844 C 1.335938 8.535156 2.261719 10.140625 3.671875 11.082031 C 2.808594 11.054688 2 10.820313 1.292969 10.425781 C 1.292969 10.449219 1.292969 10.46875 1.292969 10.492188 C 1.292969 13.035156 3.101563 15.15625 5.503906 15.640625 C 5.0625 15.761719 4.601563 15.824219 4.121094 15.824219 C 3.78125 15.824219 3.453125 15.792969 3.132813 15.730469 C 3.800781 17.8125 5.738281 19.335938 8.035156 19.375 C 6.242188 20.785156 3.976563 21.621094 1.515625 21.621094 C 1.089844 21.621094 0.675781 21.597656 0.265625 21.550781 C 2.585938 23.039063 5.347656 23.90625 8.3125 23.90625 C 17.96875 23.90625 23.25 15.90625 23.25 8.972656 C 23.25 8.742188 23.246094 8.515625 23.234375 8.289063 C 24.261719 7.554688 25.152344 6.628906 25.855469 5.574219"></path>
              </svg>
            </a>
            {/* Instagram Icon  */}
            <a
              href="https://www.instagram.com/nutriinutsofficial?igsh=MWRnaTk5Y3B6bDBqZg=="
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16,21H8c-2.8,0-5-2.2-5-5V8c0-2.8,2.2-5,5-5h8c2.8,0,5,2.2,5,5v8C21,18.8,18.8,21,16,21z"
                  opacity=".35"
                ></path>
                <circle cx="17" cy="7" r="1"></circle>
                <g>
                  <path d="M12,7c-2.8,0-5,2.2-5,5s2.2,5,5,5s5-2.2,5-5S14.8,7,12,7z M12,15c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S13.7,15,12,15z"></path>
                </g>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
