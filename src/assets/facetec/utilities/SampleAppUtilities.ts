import { Config } from '../Config';
import { FaceTecSDK } from '../core-sdk/FaceTecSDK.js/FaceTecSDK';
import { UI } from './UIFunctions';
import {FaceTecIDScanResult, FaceTecSessionResult} from '../core-sdk/FaceTecSDK.js/FaceTecPublicApi';

export const SampleAppUtilities = ( function() {

    function displayStatus( message: string ) {
        // (document.getElementById('status') as HTMLElement).innerHTML = message;
    }

    function fadeInMainUIContainer() {
        UI('.loading-session-token-container').fadeOut(1);
        UI('#theme-transition-overlay').fadeOut(800);
        UI( '.wrapping-box-container' ).fadeIn( 800 );
    }

    function fadeInMainUIControls( callback?: () => void ) {
        if ( isLikelyMobileDevice() ) {
            UI( '#custom-logo-container' ).fadeIn( 800 );
        }
        UI( '#controls' ).fadeIn( 800, () => {
            enableControlButtons();
            if ( callback ) {
                callback();
            }
        } );
    }

    // Disable buttons to prevent hammering, fade out main interface elements, and reset the Session Review Screen data.
    function fadeOutMainUIAndPrepareForSession() {
        disableControlButtons();
        if ( isLikelyMobileDevice() ) {
            UI( '#custom-logo-container' ).fadeOut( 800 );
        }
        UI( '#controls' ).fadeOut( 800 );
        UI( '.wrapping-box-container' ).fadeOut( 800 );
    }

    function disableControlButtons() {
        document.querySelectorAll( '#controls > button' ).forEach( function( button ) {
            button.setAttribute( 'disabled', 'true' );
        } );
    }

    function enableControlButtons() {
        document.querySelectorAll( '#controls > button' ).forEach( function( button ) {
            button.removeAttribute( 'disabled' );
        } );
    }

    function showMainUI() {
        fadeInMainUIContainer();
        fadeInMainUIControls();
    }

    function handleErrorGettingServerSessionToken() {
        showMainUI();
        displayStatus( 'Session could not be started due to an unexpected issue during the network request.' );
    }

    function generateUUId() {
        // @ts-ignore
        return ( [ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11 ).replace( /[018]/g, c =>
            ( c ^ crypto.getRandomValues( new Uint8Array( 1 ) )[ 0 ] & 15 >> c / 4 ).toString( 16 )
        );
    }
    function formatUIForDevice() {
        if (isLikelyMobileDevice()) {
            const windowWidth = window.innerWidth;

            // Adjust button sizing
            document.querySelectorAll('button').forEach(function(element) {
                if (element.className === 'big-button') {
                    (element as HTMLElement).style.height = '40px';
                    if (windowWidth <= 320) {
                        (element as HTMLElement).style.fontSize = '16px';
                    } else {
                        (element as HTMLElement).style.fontSize = '18px';
                    }
                } else if (element.className === 'medium-button') {
                    (element as HTMLElement).style.height = '30px';
                    (element as HTMLElement).style.fontSize = '14px';
                }

                (element as HTMLElement).style.width = '60%';
            });
            // Adjust main interface display
            (document.getElementById('main-interface') as HTMLElement).style.display = 'contents';
            (document.getElementById('main-interface') as HTMLElement).style.backgroundColor = 'transparent';
            // Hide border around control panel and adjust height
            (document.getElementById('controls') as HTMLElement).style.height = 'auto';
            (document.getElementById('controls') as HTMLElement).style.borderColor = 'transparent';
            (document.getElementById('controls') as HTMLElement).style.backgroundColor = 'transparent';
            // Hide status label text background and decrease label font size
            (document.getElementById('status') as HTMLElement).style.backgroundColor = 'transparent';
            (document.getElementById('status') as HTMLElement).style.fontSize = '12px';
            (document.getElementById('status') as HTMLElement).style.position = 'inherit';
            (document.getElementById('status') as HTMLElement).style.width = '90%';
            (document.getElementById('status') as HTMLElement).style.margin = '0 auto';
            (document.getElementById('status') as HTMLElement).style.bottom = 'unset';
            // Move and update vocal guidance icon
            (document.getElementById('vocal-icon-container') as HTMLElement)!.parentNode!.parentNode!.parentNode!.parentNode!.insertBefore( document.getElementById('vocal-icon-container')!,
                (document.getElementById('vocal-icon-container') as HTMLElement)!.parentNode!.parentNode!.parentNode!.parentNode!.firstChild);
            document.querySelectorAll('.vocal-icon').forEach(function(icon) {
                (<HTMLElement>icon).style.height = '30px';
                (<HTMLElement>icon).style.margin = '20px';
                (<HTMLElement>icon).style.transform = 'translateX(calc(-100% - 40px))';
            });
            // Move logo above buttons
            (document.getElementById('custom-logo-container') as HTMLElement)!.parentNode!.insertBefore(document.getElementById('custom-logo-container')!, document.getElementById('custom-logo-container')!.parentNode!.firstChild);
            (document.getElementById('custom-logo-container') as HTMLElement)!.style.margin = '0px 0px 20px 0px';
            (document.querySelector('#custom-logo-container img') as HTMLElement).style.height = '40px';
            // Center control interface on screen
            (document.getElementsByClassName('wrapping-box-container')[0] as HTMLElement).style.top = '50%';
            (document.getElementsByClassName('wrapping-box-container')[0] as HTMLElement).style.left = '50%';
            (document.getElementsByClassName('wrapping-box-container')[0] as HTMLElement).style.transform = 'translate(-50%, -50%)';
            // Adjust button margins
            (document.getElementById('liveness-button') as HTMLElement).style.marginTop = 'unset';
            (document.getElementById('design-showcase-button') as HTMLElement).style.marginBottom = 'unset';
            // Setup footer sizing
            let footerFontSize = '100%';
            if (windowWidth < 768) {
                footerFontSize = '9px';
            }
            if (windowWidth < 415) {
                footerFontSize = '8px';
            }
            if (windowWidth <= 360) {
                footerFontSize = '7px';
            }

            UI('footer').css({
                'font-size': footerFontSize,
                'line-height': '9px'
            });
            UI('footer span p').css({'font-size': 'inherit'} );
            UI('footer span, footer span p').css({'margin': 0});
            (document.querySelector('hr') as HTMLElement).classList.remove('display-none');
            const computedFooterFontSize = window.getComputedStyle((document.querySelector('footer span p') as HTMLElement)).fontSize;
            UI('#copy-right-length').css({'font-size': computedFooterFontSize});
            const copyRightStringLength = (document.getElementById('copy-right-length') as HTMLElement).clientWidth;
            UI('hr').css({'width': copyRightStringLength + 'px'});

            // Allow time for the UI to fully load before fading in the body
            requestAnimationFrame ( () => {
                requestAnimationFrame ( () => {
                    displayElementsAfterStyling();
                });
            });
        } else {
            displayElementsAfterStyling();
        }
    }
    function displayElementsAfterStyling() {
        document.querySelectorAll('button').forEach(function(element) {
            element.classList.add('button-transitions');
        });
        UI('footer').fadeIn(800);
        UI('body').fadeIn(800);
    }

    function disableVocalGuidanceButtons() {
        document.querySelectorAll('.vocal-icon').forEach( (button) => {
            (<HTMLButtonElement>button).setAttribute('disabled', 'true');
        });
    }

    function enableVocalGuidanceButtons() {
        document.querySelectorAll('.vocal-icon').forEach( (button) => {
            (<HTMLButtonElement>button).removeAttribute('disabled');
        });
    }

    function isLikelyMobileDevice() {
        let isMobileDeviceUA = !!( /Android|iPhone|iPad|iPod|IEMobile|Mobile|mobile/i.test( navigator.userAgent || '' ) );
        // ChromeOS/Chromebook detection.
        if ( isMobileDeviceUA && ( ( navigator.userAgent.indexOf( 'CrOS' ) !== -1 ) || ( navigator.userAgent.indexOf( 'Chromebook' ) !== -1 ) ) ) {
            isMobileDeviceUA = false;
        }
        // Mobile device determination based on portrait / landscape and user agent.
        if ( screen.width < screen.height || isMobileDeviceUA ) {
            // Assume mobile device when in portrait mode or when determined by the user agent.
            return true;
        } else {
            return false;
        }
    }
    function disableAllButtons() {
        (document.getElementById('enroll-button') as HTMLElement).setAttribute('disabled', 'true');
        (document.getElementById('id-scan-button') as HTMLElement).setAttribute('disabled', 'true');
        (document.getElementById('liveness-button') as HTMLElement).setAttribute('disabled', 'true');
        (document.getElementById('authenticate-button') as HTMLElement).setAttribute('disabled', 'true');
        (document.getElementById('audit-trail-button') as HTMLElement).setAttribute('disabled', 'true');
        (document.getElementById('design-showcase-button') as HTMLElement).setAttribute('disabled', 'true');
    }

    function enableAllButtons() {
        (document.getElementById('enroll-button') as HTMLElement).removeAttribute('disabled');
        (document.getElementById('id-scan-button') as HTMLElement).removeAttribute('disabled');
        (document.getElementById('liveness-button') as HTMLElement).removeAttribute('disabled');
        (document.getElementById('authenticate-button') as HTMLElement).removeAttribute('disabled');
        (document.getElementById('audit-trail-button') as HTMLElement).removeAttribute('disabled');
        (document.getElementById('design-showcase-button') as HTMLElement).removeAttribute('disabled');
    }

    function fadeInBlurOverlay() {
        (document.getElementById('controls') as HTMLElement).classList.add('blur-content');
    }

    function fadeOutBlurOverlay() {
        if ((document.getElementById('controls') as HTMLElement).classList.contains('blur-content')) {
            (document.getElementById('controls') as HTMLElement).classList.remove('blur-content');
        }
    }

    function showAuditTrailImages(sessionResult: FaceTecSessionResult | null, idScanResult: FaceTecIDScanResult | null) {
        const auditTrailImages: string[] = [];
        if (sessionResult != null && sessionResult.auditTrail != null && sessionResult.auditTrail.length > 0) {
            disableAllButtons();
            fadeInBlurOverlay();
            // Add the regular audit trail images
            sessionResult.auditTrail.forEach(function(image: String) {
                auditTrailImages.push('data:image/jpeg;base64,' + image);
            });
            if(idScanResult != null && idScanResult.frontImages != null && idScanResult.frontImages.length > 0) {
                // Add ID Scan front images
                auditTrailImages.unshift('data:image/jpeg;base64,' + idScanResult.frontImages[0]);
            }
            auditTrailImages.forEach(function(img) {
                addDismissibleImagePopUp(img);
            });
        } else {
            displayStatus('No Audit Trail Images');
        }
    }

    function addDismissibleImagePopUp(img: string){
        const auditTrailOverlay = document.createElement('div');
        const auditTrailImage = new Image();
        auditTrailImage.src = img;
        auditTrailImage.classList.add('audit-trail-image');
        auditTrailOverlay.classList.add('audit-trail-overlay');
        auditTrailOverlay.onclick = function() {
            if (document.querySelectorAll('.audit-trail-overlay').length === 1) {
                fadeOutBlurOverlay();
                auditTrailOverlay.style.transition = '0.3s';
                auditTrailOverlay.style.opacity = '0';
                const _this = this;

                setTimeout(function() {
                    enableAllButtons();
                    (_this as HTMLElement).remove();
                }, 500);
            } else {
                (this as HTMLElement).remove();
            }
        };
        auditTrailOverlay.append(auditTrailImage);
        (document.getElementById('controls') as HTMLElement).append(auditTrailOverlay);
    }




    return {
        displayStatus,
        fadeOutMainUIAndPrepareForSession,
        enableControlButtons,
        generateUUId,
        formatUIForDevice,
        handleErrorGettingServerSessionToken,
        showMainUI,
        isLikelyMobileDevice,
        showAuditTrailImages,
        UI
    };
} )();
