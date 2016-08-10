var React = require('react');
var browser = require('detect-browser');
import LogoImg from '../../img/'
var DownloadPage = React.createClass({
  componentDidMount: function() {
    if (browser.name === 'safari') {
      var dLink = document.getElementById('safari-download-link');
      dLink.focus();
      dLink.setSelectionRange(0, dLink.value.length)
    }
  },
  renderButtons: function() {
    return (
      <div className="btn-wrap">

        <div className="btn-group">

          <a href="http://cdn.swipesapp.com/appdownloads/Swipes-win32-ia32.zip" traget="_blank">
            <button>
              <svg id="Layer_8" data-name="Layer 8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.93837 20">
                <path d="M7203.06163,11991.83167l8.14818-1.1097,0.00356,7.85958-8.1443.04638Zm8.1443,7.65546,0.00632,7.86643-8.1443-1.11972-0.00046-6.79948Zm0.98775-8.91033,10.80381-1.5768v9.48159l-10.80381.08577v-7.99056ZM7223,11999.5611l-0.00253,9.4389-10.80381-1.52484-0.01514-7.93173Z" transform="translate(-7203.06163 -11989)"/>
              </svg>

              Windows 32bit
            </button>
          </a>

          <a href="http://cdn.swipesapp.com/appdownloads/Swipes-win32-x64.zip" traget="_blank">
            <button>
              <svg id="Layer_8" data-name="Layer 8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.93837 20">
                <path d="M7203.06163,11991.83167l8.14818-1.1097,0.00356,7.85958-8.1443.04638Zm8.1443,7.65546,0.00632,7.86643-8.1443-1.11972-0.00046-6.79948Zm0.98775-8.91033,10.80381-1.5768v9.48159l-10.80381.08577v-7.99056ZM7223,11999.5611l-0.00253,9.4389-10.80381-1.52484-0.01514-7.93173Z" transform="translate(-7203.06163 -11989)"/>
              </svg>

              Windows 64bit
            </button>
          </a>

        </div>

        <div className="btn-group">

          <a href="http://cdn.swipesapp.com/appdownloads/SwipesWorkspace.dmg" traget="_blank">
            <button>
              <svg id="Layer_8" data-name="Layer 8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.058 25">
                <path d="M7266.61666,12036.48259a13.59168,13.59168,0,0,1-1.3441,2.41659,12.27762,12.27762,0,0,1-1.73143,2.09253,3.35874,3.35874,0,0,1-2.22524.97991,5.57728,5.57728,0,0,1-2.05549-.49073,5.89819,5.89819,0,0,0-2.2129-.48918,6.09821,6.09821,0,0,0-2.27555.48918,6.12264,6.12264,0,0,1-1.9663.517,3.16247,3.16247,0,0,1-2.27555-1.00615,12.89223,12.89223,0,0,1-1.8109-2.1666,14.98429,14.98429,0,0,1-1.91507-3.80389,13.92853,13.92853,0,0,1-.80414-4.53351,8.279,8.279,0,0,1,1.08716-4.33135,6.37753,6.37753,0,0,1,2.27694-2.30317,6.12529,6.12529,0,0,1,3.0783-.86865,7.24823,7.24823,0,0,1,2.38095.55415,7.654,7.654,0,0,0,1.88852.55539,11.30011,11.30011,0,0,0,2.09407-.65415,6.92164,6.92164,0,0,1,2.84636-.50538,6.04372,6.04372,0,0,1,4.73442,2.49267,5.46605,5.46605,0,0,0-1.06016,8.76069,5.69492,5.69492,0,0,0,1.73143,1.13577q-0.20832.60414-.44134,1.15891h0Zm-4.82393-18.98245a5.33327,5.33327,0,0,1-1.36724,3.4982,4.65806,4.65806,0,0,1-3.86886,1.90966,3.89218,3.89218,0,0,1-.029-0.47375,5.47956,5.47956,0,0,1,1.45042-3.53508,5.58439,5.58439,0,0,1,1.76692-1.32666,5.2683,5.2683,0,0,1,2.02154-.57251,4.54125,4.54125,0,0,1,.02623.50012v0Z" transform="translate(-7246 -12017)" />
              </svg>

              OS X
            </button>
          </a>

        </div>

        <div className="btn-group">

          <a href="http://cdn.swipesapp.com/appdownloads/Swipes-linux-ia32.zip" traget="_blank">
            <button>
              <svg id="Layer_8" data-name="Layer 8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.24458 25">
                <path d="M7282.99944,12009.10866a0.08107,0.08107,0,0,1-.08277.08278h-0.08277a0.313,0.313,0,0,1-.16555-0.16555,0.289,0.289,0,0,1-.08277-0.16555c0-.08277,0-0.08277.08277-0.08277l0.16555,0.08277a0.43863,0.43863,0,0,1,.16555.24832m-1.48992-.82773c0-.41386-0.16555-0.66218-0.41387-0.66218a0.08107,0.08107,0,0,1-.08277.08277v0.16555h0.24832c0,0.16554.08277,0.24831,0.08277,0.41386h0.16555m2.89706-.41386a0.45318,0.45318,0,0,1,.33109.41386h0.16555a0.30408,0.30408,0,0,1-.08277-0.24832,0.30409,0.30409,0,0,0-.08277-0.24832,0.4386,0.4386,0,0,0-.24832-0.16554,0.289,0.289,0,0,1-.16555.08277c0,0.08277.08277,0.08277,0.08277,0.16555m-2.4832,1.32437c-0.08277,0-.08277,0-0.08277-0.08278a0.30409,0.30409,0,0,1,.08277-0.24832,0.36255,0.36255,0,0,0,.24832-0.08277,0.08106,0.08106,0,0,1,.08277.08277,0.6462,0.6462,0,0,1-.24832.3311h-0.08277m-0.91051-.08278a0.7754,0.7754,0,0,1-.41387-0.82773,0.69839,0.69839,0,0,1,.16555-0.57941,0.45519,0.45519,0,0,1,.41387-0.24832,0.56493,0.56493,0,0,1,.41387.24832,2.41687,2.41687,0,0,1,.16555.745v0.16554h0.08277v-0.08277c0.08277,0,.08277-0.16555.08277-0.49664a1.2301,1.2301,0,0,0-.16555-0.745,0.73724,0.73724,0,0,0-.66219-0.41386,0.62245,0.62245,0,0,0-.57941.41386,1.9465,1.9465,0,0,0-.19866.99328,1.35589,1.35589,0,0,0,.447.99328c0.08277-.08277.16555-0.08277,0.24832-0.16555m10.34665,11.671c0.08277,0,.08277-0.03311.08277-0.10761a0.89974,0.89974,0,0,0-.33109-0.63735,2.021,2.021,0,0,0-1.15883-.47181c-0.08277-.00827-0.16555-0.00827-0.16555-0.00827a0.563,0.563,0,0,0-.16555-0.01656c-0.08277-.00828-0.24832-0.02483-0.33109-0.04139a6.58169,6.58169,0,0,0,.33109-2.04449,3.24529,3.24529,0,0,0-.49664-1.90379,1.67821,1.67821,0,0,0-1.07605-.82773,0.16523,0.16523,0,0,0-.08277.16555,2.07175,2.07175,0,0,1,1.07605.99327,3.94565,3.94565,0,0,1,.33109,1.65547,5.78448,5.78448,0,0,1-.41387,2.02794,1.8739,1.8739,0,0,0-.91051.91879c0,0.07449,0,.11588.08277,0.11588a0.97932,0.97932,0,0,0,.16555-0.21521c0.16555-.14072.24832-0.28143,0.41387-0.42215a1.23016,1.23016,0,0,1,.66219-0.21521,2.81174,2.81174,0,0,1,1.07605.17383,1.002,1.002,0,0,1,.57941.35592q0.12416,0.18624.24832,0.34765a0.189,0.189,0,0,0,.08277.15727m-7.61514-12.00212a0.62027,0.62027,0,0,1-.08277-0.41387,1.11277,1.11277,0,0,1,.16555-0.745,0.71542,0.71542,0,0,1,.49664-0.24832,0.83781,0.83781,0,0,1,.57941.33109,1.948,1.948,0,0,1,.16555.66218,0.6655,0.6655,0,0,1-.49664.745,0.289,0.289,0,0,0,.16555.08278,0.874,0.874,0,0,1,.41387.16554,7.34554,7.34554,0,0,0,.16555-1.2416,1.87821,1.87821,0,0,0-.24832-1.076,1.0627,1.0627,0,0,0-.82773-0.33109,1.33505,1.33505,0,0,0-.745.24832,1.10076,1.10076,0,0,0-.24832.66219,2.2913,2.2913,0,0,0,.24832,1.076c0.08277,0,.16555.08277,0.24832,0.08277m0.99328,1.32437a4.84317,4.84317,0,0,1-2.566,1.076,2.62875,2.62875,0,0,1-1.65546-.66218,1.80931,1.80931,0,0,0,.24832.41386l0.49664,0.49664a1.6342,1.6342,0,0,0,1.15883.49664,3.951,3.951,0,0,0,2.06933-.9105l0.745-.49664a0.83783,0.83783,0,0,0,.33109-0.57941c0-.08278,0-0.16555-0.08277-0.16555a2.52479,2.52479,0,0,0-1.32437-.66219,4.83593,4.83593,0,0,0-1.65546-.49664,3.08225,3.08225,0,0,0-1.2416.49664,1.48723,1.48723,0,0,0-.82773.99328,1.02457,1.02457,0,0,1,.16555.24832,2.40073,2.40073,0,0,0,1.48992.66219,4.47655,4.47655,0,0,0,2.566-1.15883v0.16555a0.08106,0.08106,0,0,1,.08277.08277m1.90378,16.7202a1.77035,1.77035,0,0,0,2.06933.86084,1.08084,1.08084,0,0,0,.41387-0.15727c0.08277-.05794.16555-0.11588,0.24832-0.1821a0.988,0.988,0,0,0,.24832-0.14072l1.40715-1.21676a5.57291,5.57291,0,0,1,1.07605-.6953,7.13457,7.13457,0,0,1,.82773-0.40559,1.47724,1.47724,0,0,0,.57941-0.298,0.85429,0.85429,0,0,0,.16555-0.48009,0.74177,0.74177,0,0,0-.33109-0.55458,1.6843,1.6843,0,0,0-.49664-0.28143,1.9107,1.9107,0,0,1-.57941-0.41386,2.23235,2.23235,0,0,1-.41387-0.90223l-0.08277-.48009a1.93178,1.93178,0,0,0-.16555-0.48008c0-.02483,0-0.03311-0.08277-0.03311a0.45427,0.45427,0,0,0-.33109.21521c-0.16555.14072-.33109,0.298-0.49664,0.46353a2.047,2.047,0,0,1-.49664.45525,1.488,1.488,0,0,1-.66219.21521,1.31618,1.31618,0,0,1-1.2416-.538,3.0168,3.0168,0,0,1-.33109-0.91879,0.59859,0.59859,0,0,0-.41387-0.21521c-0.41387,0-.57941.43043-0.57941,1.29954v2.57425a2.627,2.627,0,0,0-.08277.49664,2.90886,2.90886,0,0,0-.08277.8774l-0.16555.91878v0.01407m-12.00212-.43787a13.58017,13.58017,0,0,1,2.657.721,8.84993,8.84993,0,0,0,1.83757.55458,1.80679,1.80679,0,0,0,1.45681-.75241,1.225,1.225,0,0,0,.08277-0.56617,5.33558,5.33558,0,0,0-1.41542-2.97156l-0.56286-.75324a7.82426,7.82426,0,0,1-.4387-0.72012,7.0763,7.0763,0,0,0-.45525-0.745,2.235,2.235,0,0,0-.50492-0.57114,1.69988,1.69988,0,0,0-.73668-0.38075,1.1199,1.1199,0,0,0-.70357.33937,1.01235,1.01235,0,0,0-.19866.51319,0.49,0.49,0,0,1-.15727.34765,1.50925,1.50925,0,0,1-.41387.13243c-0.04139,0-.11588,0-0.22349.00828h-0.22349a2.12855,2.12855,0,0,0-.894.13244,1.21466,1.21466,0,0,0-.31454.8029,3.77869,3.77869,0,0,0,.09933.67046,3.70742,3.70742,0,0,1,.09933.72841,1.93531,1.93531,0,0,1-.30626,1.01811,1.85131,1.85131,0,0,0-.31454.80952c0.08277,0.32116.62908,0.54713,1.63063,0.67957m2.75635-7.52409a5.15235,5.15235,0,0,1,.45525-1.94517,5.45516,5.45516,0,0,1,.88567-1.57269c-0.01656-.08277-0.05794-0.08277-0.12416-0.08277l-0.08277-.08278a6.339,6.339,0,0,0-.8774,1.65547,4.92176,4.92176,0,0,0-.52975,1.93689,1.88739,1.88739,0,0,0,.2566.97673,5.85708,5.85708,0,0,0,1.31609,1.17538l0.8774,0.57113a3.71756,3.71756,0,0,1,1.432,1.70513,0.67692,0.67692,0,0,1-.33109.538,0.78358,0.78358,0,0,1-.57941.298c-0.01655,0-.02483.01655-0.02483,0.05794,0,0.00828.08277,0.17382,0.2566,0.49664a2.53954,2.53954,0,0,0,2.08589.70357,5.01948,5.01948,0,0,0,4.30421-2.23487,1.66132,1.66132,0,0,0-.08277-0.77807v-0.30626a2.33161,2.33161,0,0,1,.24832-1.20849,0.65641,0.65641,0,0,1,.57941-0.389,0.81919,0.81919,0,0,1,.49664.1821,12.53387,12.53387,0,0,0,.08277-1.68857,7.13935,7.13935,0,0,0-.16555-1.95345,4.3629,4.3629,0,0,0-.41387-1.2416l-0.49664-.745c-0.16555-.24832-0.24832-0.49664-0.41387-0.745a3.55721,3.55721,0,0,1-.16555-0.99327c-0.24832-.41387-0.41387-0.82774-0.66219-1.2416-0.16555-.41387-0.33109-0.82774-0.49664-1.15883l-0.745.57941a3.71829,3.71829,0,0,1-2.06933.82774,1.34453,1.34453,0,0,1-1.15883-.41387l-0.49664-.41387a2.15809,2.15809,0,0,1-.24832.91051l-0.52147.99328a5.0493,5.0493,0,0,0-.38076,1.15882,1.65335,1.65335,0,0,1-.0745.3311l-0.6208,1.2416a7.32036,7.32036,0,0,0-1.00983,3.344,3.59565,3.59565,0,0,0,.04966.58769,1.22674,1.22674,0,0,1-.55458-1.076m5.92656,7.83035a5.69674,5.69674,0,0,0-2.4832.43456v-0.02483a1.859,1.859,0,0,1-1.523.75323,6.33283,6.33283,0,0,1-1.90378-.4718,22.47851,22.47851,0,0,0-2.30937-.67709c-0.06622-.019-0.21521-0.04718-0.45525-0.08526-0.23176-.03724-0.447-0.07532-0.63735-0.11339a4.80342,4.80342,0,0,1-.58769-0.16969,1.45426,1.45426,0,0,1-.49664-0.25411,0.468,0.468,0,0,1-.17051-0.35345,1.21628,1.21628,0,0,1,.08443-0.42462c0.053-.091.11092-0.1821,0.16886-0.26488a1.604,1.604,0,0,0,.14071-0.25659,1.21294,1.21294,0,0,0,.11588-0.23177,1.024,1.024,0,0,0,.08277-0.24,1.27785,1.27785,0,0,0,.03311-0.24832c0-.08277-0.03311-0.33109-0.09933-0.76979a7.46048,7.46048,0,0,1-.09933-0.81946,1.26129,1.26129,0,0,1,.26487-0.86084,0.74782,0.74782,0,0,1,.538-0.31454h0.95189a0.85131,0.85131,0,0,0,.3642-0.14071c0.05794-.13244.10761-0.24,0.14071-0.33937,0.04139-.09933.05794-0.17382,0.0745-0.20693,0.01656-.04967.03311-0.09933,0.04966-0.14072a1.14279,1.14279,0,0,1,.13244-0.19038,0.501,0.501,0,0,1-.09933-0.32281,0.844,0.844,0,0,1,.01656-0.22349,2.98629,2.98629,0,0,1,.4387-1.27471l0.28971-.52147a11.45155,11.45155,0,0,0,.55458-1.10916,10.827,10.827,0,0,0,.45525-1.48992,4.11676,4.11676,0,0,1,.94361-1.73824l0.6208-.745a5.84339,5.84339,0,0,0,.86912-1.2416,2.66694,2.66694,0,0,0,.24-1.07605c0-.16554-0.04139-0.66218-0.13244-1.48992-0.08277-.82773-0.12416-1.65546-0.12416-2.40042a5.32109,5.32109,0,0,1,.15727-1.40714,2.94287,2.94287,0,0,1,.57941-1.15883,2.221,2.221,0,0,1,1.07605-.82773,5.50265,5.50265,0,0,1,1.73824-.24832,2.29171,2.29171,0,0,1,.745.08277,2.86189,2.86189,0,0,1,.99328.24832,3.418,3.418,0,0,1,.9105.57942,3.71274,3.71274,0,0,1,.82773,1.076,8.05016,8.05016,0,0,1,.41387,1.65546c0.08277,0.41387.08277,0.82773,0.16555,1.40715,0,0.49664.08277,0.82773,0.08277,1.076,0.08277,0.24832.08277,0.57941,0.16555,0.99328a2.96519,2.96519,0,0,0,.33109.9105,6.17325,6.17325,0,0,0,.57941.99328c0.24832,0.41387.57941,0.82773,0.9105,1.32437a8.30057,8.30057,0,0,1,1.65546,2.64875,6.95384,6.95384,0,0,1,.66219,3.05433,5.62532,5.62532,0,0,1-.24832,1.66374,0.36273,0.36273,0,0,1,.33109.1821,2.3224,2.3224,0,0,1,.24832.75324l0.08277,0.61252a0.97387,0.97387,0,0,0,.41387.50492,1.84,1.84,0,0,0,.57941.37248,2.68669,2.68669,0,0,1,.57941.34765,0.736,0.736,0,0,1,.24832.52147,0.80538,0.80538,0,0,1-.24832.63735,1.29671,1.29671,0,0,1-.57941.35593c-0.16555.08277-.49664,0.24832-0.99328,0.48174a9.011,9.011,0,0,0-1.2416.89395l-0.82773.7044a4.58639,4.58639,0,0,1-.91051.69529,1.8105,1.8105,0,0,1-.91051.22349l-0.57941-.06622a1.889,1.889,0,0,1-1.32437-1.00983,28.27213,28.27213,0,0,0-3.06261-.24" transform="translate(-7272.75542 -12003)" />
              </svg>


              Linux 32bit
            </button>
          </a>

          <a href="http://cdn.swipesapp.com/appdownloads/Swipes-linux-x64.zip" traget="_blank">
            <button>
              <svg id="Layer_8" data-name="Layer 8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.24458 25">
                <path d="M7282.99944,12009.10866a0.08107,0.08107,0,0,1-.08277.08278h-0.08277a0.313,0.313,0,0,1-.16555-0.16555,0.289,0.289,0,0,1-.08277-0.16555c0-.08277,0-0.08277.08277-0.08277l0.16555,0.08277a0.43863,0.43863,0,0,1,.16555.24832m-1.48992-.82773c0-.41386-0.16555-0.66218-0.41387-0.66218a0.08107,0.08107,0,0,1-.08277.08277v0.16555h0.24832c0,0.16554.08277,0.24831,0.08277,0.41386h0.16555m2.89706-.41386a0.45318,0.45318,0,0,1,.33109.41386h0.16555a0.30408,0.30408,0,0,1-.08277-0.24832,0.30409,0.30409,0,0,0-.08277-0.24832,0.4386,0.4386,0,0,0-.24832-0.16554,0.289,0.289,0,0,1-.16555.08277c0,0.08277.08277,0.08277,0.08277,0.16555m-2.4832,1.32437c-0.08277,0-.08277,0-0.08277-0.08278a0.30409,0.30409,0,0,1,.08277-0.24832,0.36255,0.36255,0,0,0,.24832-0.08277,0.08106,0.08106,0,0,1,.08277.08277,0.6462,0.6462,0,0,1-.24832.3311h-0.08277m-0.91051-.08278a0.7754,0.7754,0,0,1-.41387-0.82773,0.69839,0.69839,0,0,1,.16555-0.57941,0.45519,0.45519,0,0,1,.41387-0.24832,0.56493,0.56493,0,0,1,.41387.24832,2.41687,2.41687,0,0,1,.16555.745v0.16554h0.08277v-0.08277c0.08277,0,.08277-0.16555.08277-0.49664a1.2301,1.2301,0,0,0-.16555-0.745,0.73724,0.73724,0,0,0-.66219-0.41386,0.62245,0.62245,0,0,0-.57941.41386,1.9465,1.9465,0,0,0-.19866.99328,1.35589,1.35589,0,0,0,.447.99328c0.08277-.08277.16555-0.08277,0.24832-0.16555m10.34665,11.671c0.08277,0,.08277-0.03311.08277-0.10761a0.89974,0.89974,0,0,0-.33109-0.63735,2.021,2.021,0,0,0-1.15883-.47181c-0.08277-.00827-0.16555-0.00827-0.16555-0.00827a0.563,0.563,0,0,0-.16555-0.01656c-0.08277-.00828-0.24832-0.02483-0.33109-0.04139a6.58169,6.58169,0,0,0,.33109-2.04449,3.24529,3.24529,0,0,0-.49664-1.90379,1.67821,1.67821,0,0,0-1.07605-.82773,0.16523,0.16523,0,0,0-.08277.16555,2.07175,2.07175,0,0,1,1.07605.99327,3.94565,3.94565,0,0,1,.33109,1.65547,5.78448,5.78448,0,0,1-.41387,2.02794,1.8739,1.8739,0,0,0-.91051.91879c0,0.07449,0,.11588.08277,0.11588a0.97932,0.97932,0,0,0,.16555-0.21521c0.16555-.14072.24832-0.28143,0.41387-0.42215a1.23016,1.23016,0,0,1,.66219-0.21521,2.81174,2.81174,0,0,1,1.07605.17383,1.002,1.002,0,0,1,.57941.35592q0.12416,0.18624.24832,0.34765a0.189,0.189,0,0,0,.08277.15727m-7.61514-12.00212a0.62027,0.62027,0,0,1-.08277-0.41387,1.11277,1.11277,0,0,1,.16555-0.745,0.71542,0.71542,0,0,1,.49664-0.24832,0.83781,0.83781,0,0,1,.57941.33109,1.948,1.948,0,0,1,.16555.66218,0.6655,0.6655,0,0,1-.49664.745,0.289,0.289,0,0,0,.16555.08278,0.874,0.874,0,0,1,.41387.16554,7.34554,7.34554,0,0,0,.16555-1.2416,1.87821,1.87821,0,0,0-.24832-1.076,1.0627,1.0627,0,0,0-.82773-0.33109,1.33505,1.33505,0,0,0-.745.24832,1.10076,1.10076,0,0,0-.24832.66219,2.2913,2.2913,0,0,0,.24832,1.076c0.08277,0,.16555.08277,0.24832,0.08277m0.99328,1.32437a4.84317,4.84317,0,0,1-2.566,1.076,2.62875,2.62875,0,0,1-1.65546-.66218,1.80931,1.80931,0,0,0,.24832.41386l0.49664,0.49664a1.6342,1.6342,0,0,0,1.15883.49664,3.951,3.951,0,0,0,2.06933-.9105l0.745-.49664a0.83783,0.83783,0,0,0,.33109-0.57941c0-.08278,0-0.16555-0.08277-0.16555a2.52479,2.52479,0,0,0-1.32437-.66219,4.83593,4.83593,0,0,0-1.65546-.49664,3.08225,3.08225,0,0,0-1.2416.49664,1.48723,1.48723,0,0,0-.82773.99328,1.02457,1.02457,0,0,1,.16555.24832,2.40073,2.40073,0,0,0,1.48992.66219,4.47655,4.47655,0,0,0,2.566-1.15883v0.16555a0.08106,0.08106,0,0,1,.08277.08277m1.90378,16.7202a1.77035,1.77035,0,0,0,2.06933.86084,1.08084,1.08084,0,0,0,.41387-0.15727c0.08277-.05794.16555-0.11588,0.24832-0.1821a0.988,0.988,0,0,0,.24832-0.14072l1.40715-1.21676a5.57291,5.57291,0,0,1,1.07605-.6953,7.13457,7.13457,0,0,1,.82773-0.40559,1.47724,1.47724,0,0,0,.57941-0.298,0.85429,0.85429,0,0,0,.16555-0.48009,0.74177,0.74177,0,0,0-.33109-0.55458,1.6843,1.6843,0,0,0-.49664-0.28143,1.9107,1.9107,0,0,1-.57941-0.41386,2.23235,2.23235,0,0,1-.41387-0.90223l-0.08277-.48009a1.93178,1.93178,0,0,0-.16555-0.48008c0-.02483,0-0.03311-0.08277-0.03311a0.45427,0.45427,0,0,0-.33109.21521c-0.16555.14072-.33109,0.298-0.49664,0.46353a2.047,2.047,0,0,1-.49664.45525,1.488,1.488,0,0,1-.66219.21521,1.31618,1.31618,0,0,1-1.2416-.538,3.0168,3.0168,0,0,1-.33109-0.91879,0.59859,0.59859,0,0,0-.41387-0.21521c-0.41387,0-.57941.43043-0.57941,1.29954v2.57425a2.627,2.627,0,0,0-.08277.49664,2.90886,2.90886,0,0,0-.08277.8774l-0.16555.91878v0.01407m-12.00212-.43787a13.58017,13.58017,0,0,1,2.657.721,8.84993,8.84993,0,0,0,1.83757.55458,1.80679,1.80679,0,0,0,1.45681-.75241,1.225,1.225,0,0,0,.08277-0.56617,5.33558,5.33558,0,0,0-1.41542-2.97156l-0.56286-.75324a7.82426,7.82426,0,0,1-.4387-0.72012,7.0763,7.0763,0,0,0-.45525-0.745,2.235,2.235,0,0,0-.50492-0.57114,1.69988,1.69988,0,0,0-.73668-0.38075,1.1199,1.1199,0,0,0-.70357.33937,1.01235,1.01235,0,0,0-.19866.51319,0.49,0.49,0,0,1-.15727.34765,1.50925,1.50925,0,0,1-.41387.13243c-0.04139,0-.11588,0-0.22349.00828h-0.22349a2.12855,2.12855,0,0,0-.894.13244,1.21466,1.21466,0,0,0-.31454.8029,3.77869,3.77869,0,0,0,.09933.67046,3.70742,3.70742,0,0,1,.09933.72841,1.93531,1.93531,0,0,1-.30626,1.01811,1.85131,1.85131,0,0,0-.31454.80952c0.08277,0.32116.62908,0.54713,1.63063,0.67957m2.75635-7.52409a5.15235,5.15235,0,0,1,.45525-1.94517,5.45516,5.45516,0,0,1,.88567-1.57269c-0.01656-.08277-0.05794-0.08277-0.12416-0.08277l-0.08277-.08278a6.339,6.339,0,0,0-.8774,1.65547,4.92176,4.92176,0,0,0-.52975,1.93689,1.88739,1.88739,0,0,0,.2566.97673,5.85708,5.85708,0,0,0,1.31609,1.17538l0.8774,0.57113a3.71756,3.71756,0,0,1,1.432,1.70513,0.67692,0.67692,0,0,1-.33109.538,0.78358,0.78358,0,0,1-.57941.298c-0.01655,0-.02483.01655-0.02483,0.05794,0,0.00828.08277,0.17382,0.2566,0.49664a2.53954,2.53954,0,0,0,2.08589.70357,5.01948,5.01948,0,0,0,4.30421-2.23487,1.66132,1.66132,0,0,0-.08277-0.77807v-0.30626a2.33161,2.33161,0,0,1,.24832-1.20849,0.65641,0.65641,0,0,1,.57941-0.389,0.81919,0.81919,0,0,1,.49664.1821,12.53387,12.53387,0,0,0,.08277-1.68857,7.13935,7.13935,0,0,0-.16555-1.95345,4.3629,4.3629,0,0,0-.41387-1.2416l-0.49664-.745c-0.16555-.24832-0.24832-0.49664-0.41387-0.745a3.55721,3.55721,0,0,1-.16555-0.99327c-0.24832-.41387-0.41387-0.82774-0.66219-1.2416-0.16555-.41387-0.33109-0.82774-0.49664-1.15883l-0.745.57941a3.71829,3.71829,0,0,1-2.06933.82774,1.34453,1.34453,0,0,1-1.15883-.41387l-0.49664-.41387a2.15809,2.15809,0,0,1-.24832.91051l-0.52147.99328a5.0493,5.0493,0,0,0-.38076,1.15882,1.65335,1.65335,0,0,1-.0745.3311l-0.6208,1.2416a7.32036,7.32036,0,0,0-1.00983,3.344,3.59565,3.59565,0,0,0,.04966.58769,1.22674,1.22674,0,0,1-.55458-1.076m5.92656,7.83035a5.69674,5.69674,0,0,0-2.4832.43456v-0.02483a1.859,1.859,0,0,1-1.523.75323,6.33283,6.33283,0,0,1-1.90378-.4718,22.47851,22.47851,0,0,0-2.30937-.67709c-0.06622-.019-0.21521-0.04718-0.45525-0.08526-0.23176-.03724-0.447-0.07532-0.63735-0.11339a4.80342,4.80342,0,0,1-.58769-0.16969,1.45426,1.45426,0,0,1-.49664-0.25411,0.468,0.468,0,0,1-.17051-0.35345,1.21628,1.21628,0,0,1,.08443-0.42462c0.053-.091.11092-0.1821,0.16886-0.26488a1.604,1.604,0,0,0,.14071-0.25659,1.21294,1.21294,0,0,0,.11588-0.23177,1.024,1.024,0,0,0,.08277-0.24,1.27785,1.27785,0,0,0,.03311-0.24832c0-.08277-0.03311-0.33109-0.09933-0.76979a7.46048,7.46048,0,0,1-.09933-0.81946,1.26129,1.26129,0,0,1,.26487-0.86084,0.74782,0.74782,0,0,1,.538-0.31454h0.95189a0.85131,0.85131,0,0,0,.3642-0.14071c0.05794-.13244.10761-0.24,0.14071-0.33937,0.04139-.09933.05794-0.17382,0.0745-0.20693,0.01656-.04967.03311-0.09933,0.04966-0.14072a1.14279,1.14279,0,0,1,.13244-0.19038,0.501,0.501,0,0,1-.09933-0.32281,0.844,0.844,0,0,1,.01656-0.22349,2.98629,2.98629,0,0,1,.4387-1.27471l0.28971-.52147a11.45155,11.45155,0,0,0,.55458-1.10916,10.827,10.827,0,0,0,.45525-1.48992,4.11676,4.11676,0,0,1,.94361-1.73824l0.6208-.745a5.84339,5.84339,0,0,0,.86912-1.2416,2.66694,2.66694,0,0,0,.24-1.07605c0-.16554-0.04139-0.66218-0.13244-1.48992-0.08277-.82773-0.12416-1.65546-0.12416-2.40042a5.32109,5.32109,0,0,1,.15727-1.40714,2.94287,2.94287,0,0,1,.57941-1.15883,2.221,2.221,0,0,1,1.07605-.82773,5.50265,5.50265,0,0,1,1.73824-.24832,2.29171,2.29171,0,0,1,.745.08277,2.86189,2.86189,0,0,1,.99328.24832,3.418,3.418,0,0,1,.9105.57942,3.71274,3.71274,0,0,1,.82773,1.076,8.05016,8.05016,0,0,1,.41387,1.65546c0.08277,0.41387.08277,0.82773,0.16555,1.40715,0,0.49664.08277,0.82773,0.08277,1.076,0.08277,0.24832.08277,0.57941,0.16555,0.99328a2.96519,2.96519,0,0,0,.33109.9105,6.17325,6.17325,0,0,0,.57941.99328c0.24832,0.41387.57941,0.82773,0.9105,1.32437a8.30057,8.30057,0,0,1,1.65546,2.64875,6.95384,6.95384,0,0,1,.66219,3.05433,5.62532,5.62532,0,0,1-.24832,1.66374,0.36273,0.36273,0,0,1,.33109.1821,2.3224,2.3224,0,0,1,.24832.75324l0.08277,0.61252a0.97387,0.97387,0,0,0,.41387.50492,1.84,1.84,0,0,0,.57941.37248,2.68669,2.68669,0,0,1,.57941.34765,0.736,0.736,0,0,1,.24832.52147,0.80538,0.80538,0,0,1-.24832.63735,1.29671,1.29671,0,0,1-.57941.35593c-0.16555.08277-.49664,0.24832-0.99328,0.48174a9.011,9.011,0,0,0-1.2416.89395l-0.82773.7044a4.58639,4.58639,0,0,1-.91051.69529,1.8105,1.8105,0,0,1-.91051.22349l-0.57941-.06622a1.889,1.889,0,0,1-1.32437-1.00983,28.27213,28.27213,0,0,0-3.06261-.24" transform="translate(-7272.75542 -12003)" />
              </svg>

              Linux 64bit
            </button>
          </a>

        </div>

      </div>
    )
  },
  selectText: function() {
    var dLink = document.getElementById('safari-download-link');
    dLink.focus();
    dLink.setSelectionRange(0, dLink.value.length)
  },
  renderLink: function() {

    return (
      <input ref="downloadLink" id="safari-download-link" type="text" value="http://swipesapp.com/mac" readOnly="true" onClick={this.selectText}/>
    )
  },
  renderWebsite: function() {
    var downloadOptions;
    var microCopy = 'Download it below.';

    if (browser.name === 'safari') {
      downloadOptions = this.renderLink();
      microCopy = 'Copy the link below'
    } else {
      downloadOptions = this.renderButtons()
    }

    return (
      <div className="dl-card">
        <img src={LogoImg}/>
        <h6>NEW VERSION OF SWIPES</h6>
        <p>Great news! Swipes is now available for your operating system. <br /> {microCopy}</p>
        {downloadOptions}
      </div>
    )
  },
  render() {
    return (
      <div className="dl-page-wrapper">
        {this.renderWebsite()}
      </div>
    )
  }
})

module.exports = DownloadPage;
