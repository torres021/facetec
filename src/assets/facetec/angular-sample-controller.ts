import { Config } from './Config';
import { FaceTecSDK } from './core-sdk/FaceTecSDK.js/FaceTecSDK';
import { LivenessCheckProcessor } from './processors/LivenessCheckProcessor';
import { SampleAppUtilities } from './utilities/SampleAppUtilities';
import { FaceTecSessionResult, FaceTecIDScanResult } from './core-sdk/FaceTecSDK.js/FaceTecPublicApi';
import { Subject } from 'rxjs';

import {FacetecMensajeInitCustom, FacetecMensajesCustom} from './facetec-mensajes-custom';
import { PhotoIDMatchProcessor } from './processors/PhotoIDMatchProcessor';
import { EnrollmentProcessor } from './processors/EnrollmentProcessor';
import { AuthenticateProcessor } from './processors/AuthenticateProcessor';
import {FaceTecNotificar} from '../../app/models/face-tec-notificar';

export const AngularSampleApp = (function() {
  let latestEnrollmentIdentifier = '';
  let latestSessionResult: FaceTecSessionResult | null = null;
  let latestIDScanResult: FaceTecIDScanResult | null = null;
  let latestProcessor: LivenessCheckProcessor;
  let notificador: Subject<FaceTecNotificar>;

  // const faceteci18n = {
  //   'FaceTec_accessibility_cancel_button': 'Cancelar',
  //   'FaceTec_feedback_center_face': 'Centra tu rostro',
  //   'FaceTec_feedback_face_not_found': 'Enmarca tu rostro',
  //   'FaceTec_feedback_move_phone_away': 'Aleja tu rostro',
  //   'FaceTec_feedback_move_away_web': 'Aleja tu rostro',
  //   'FaceTec_feedback_move_phone_closer': 'Acerca tu cara un poco más',
  //   'FaceTec_feedback_move_phone_to_eye_level': 'Mueve el teléfono hacia tu ojo',
  //   'FaceTec_feedback_move_to_eye_level_web': 'Mira directo a la cámara',
  //   'FaceTec_feedback_face_not_looking_straight_ahead': 'Mira hacia adelante',
  //   'FaceTec_feedback_face_not_upright': 'Manten tu cabeza recta',
  //   'FaceTec_feedback_face_not_upright_mobile': 'Manten tu cabeza recta',
  //   'FaceTec_feedback_hold_steady': 'Quédate quieto un momento',
  //   'FaceTec_feedback_move_web_closer': 'Muévete más cerca',
  //   'FaceTec_feedback_move_web_even_closer': 'Un poco más cerca',
  //   'FaceTec_feedback_use_even_lighting': 'Ilumina mejor tu rostro de forma uniforme',
  //   'FaceTec_instructions_header_ready': 'Prepárate para tu foto',
  //   'FaceTec_instructions_header_ready_desktop': 'Prepárate para tu foto',
  //   'FaceTec_instructions_header_ready_1_mobile': 'Prepárate para tu foto',
  //   'FaceTec_instructions_header_ready_2_mobile': '',
  //   'FaceTec_instructions_header_ready_1': 'Prepárate para tu foto',
  //   'FaceTec_instructions_header_ready_2': '',
  //   'FaceTec_instructions_message_ready': 'Ubica tu cara dentro del óvalo y presiona "Iniciar reconocimiento"',
  //   'FaceTec_instructions_message_ready_desktop': 'Ubica tu cara dentro del óvalo y presiona "Iniciar reconocimiento"',
  //   'FaceTec_instructions_message_ready_1_mobile': 'Ubica tu cara dentro del óvalo',
  //   'FaceTec_instructions_message_ready_2_mobile': 'y presiona "Iniciar reconocimiento"',
  //   'FaceTec_instructions_message_ready_1': 'Ubica tu cara dentro del óvalo',
  //   'FaceTec_instructions_message_ready_2': 'y presiona "Iniciar reconocimiento"',
  //   'FaceTec_action_im_ready': 'Iniciar reconocimiento',
  //   'FaceTec_result_facescan_upload_message': 'Cargando<br/>Escaneo de rostro',
  //   'FaceTec_result_idscan_upload_message': 'Cargando<br/>Cifrado de<br/>Documento',
  //   'FaceTec_retry_header': 'Intentemos de nuevo',
  //   'FaceTec_retry_subheader_message': 'Que puedes hacer para mejorarla?',
  //   'FaceTec_retry_your_image_label': 'Tu foto',
  //   'FaceTec_retry_ideal_image_label': 'Foto ideal',
  //   'FaceTec_retry_instruction_message_1': 'No sonrias, pon una expresión tranquila </br>y prueba una vez mas.',
  //   'FaceTec_retry_instruction_message_2': 'Ubícate en un lugar con luz intermedia',
  //   'FaceTec_retry_instruction_message_3': 'Limpia tu cámara, prueba una vez más',
  //   'FaceTec_action_try_again': 'Reintentar',
  //   'FaceTec_action_ok': 'OK',
  //   'FaceTec_device_incompatible_header': '<b>El dispositivo no es compatible</b>',
  //   'FaceTec_device_incompatible_message': 'Parece que hay un problema con tu dispositivo. Inténtalo desde otro dispositivo.,<br> o visita <a href=\'https://livenesscheckhelp.com/\' target=\'_blank\' style=\'text-decoration: underline;\'>LivenessCheckHelp.com</a> para recomendaciones sobre como mejorar el dispositivo.',
  //   'FaceTec_device_incompatible_action': 'Intentemos una vez más',
  //   'FaceTec_camera_feed_issue_header': '<b>Problema al cifrar la transmisión de la cámara</b>',
  //   'FaceTec_camera_feed_issue_subheader_message': 'Este sistema no se puede verificar debido a lo siguiente:',
  //   'FaceTec_camera_feed_issue_table_header_1': 'Posible Problema',
  //   'FaceTec_camera_feed_issue_table_header_2': 'Corregir',
  //   'FaceTec_camera_feed_issue_table_row_1_cell_1_firefox_permissions_error': 'Los permisos de la cámara no se recuerdan en Firefox.',
  //   'FaceTec_camera_feed_issue_table_row_1_cell_2_firefox_permissions_error': 'Marca Recordar Permisos.',
  //   'FaceTec_camera_feed_issue_table_row_1_cell_1': 'Cámara en uso por otra aplicación.',
  //   'FaceTec_camera_feed_issue_table_row_1_cell_2': 'Cierra la otra aplicación.',
  //   'FaceTec_camera_feed_issue_table_row_2_cell_1': 'Una aplicación de terceros está modificando el video.',
  //   'FaceTec_camera_feed_issue_table_row_2_cell_2': 'Cierra/Desinstala la otra aplicación.',
  //   'FaceTec_camera_feed_issue_table_row_3_cell_1': 'El hardware no se puede proteger.',
  //   'FaceTec_camera_feed_issue_table_row_3_cell_2': 'Usa un dispositivo diferente',
  //   'FaceTec_camera_feed_issue_subtable_message': 'Esta aplicación bloquea las configuraciones sospechosas de cámaras web. <a href=\'https://livenesscheckhelp.com/\' target=\'_blank\' style=\'text-decoration:underline;\'>Aprende más aquí</a>.',
  //   'FaceTec_camera_feed_issue_action': 'Intentemos una vez más',
  //   'FaceTec_camera_feed_issue_action_firefox_permissions_error': 'OK',
  //   'FaceTec_camera_permission_header': '<b>Debes autorizar el uso de la camara</b>',
  //   'FaceTec_camera_permission_message': 'Los permisos de tu cámara están deshabilitados.<br/>Verifica tu sistema operativo y la configuración del navegador.',
  //   'FaceTec_camera_permission_message_auth': 'Presiona el botón "Habilitar cámara" para continuar.',
  //   'FaceTec_camera_permission_launch_settings': 'Ok',
  //   'FaceTec_camera_permission_enable_camera': 'Habilitar cámara',
  //   'FaceTec_enter_fullscreen_header': 'Pantalla Completa Modo Selfie',
  //   'FaceTec_enter_fullscreen_message': 'Antes de iniciar, por favor haz clic en el botón que está abajo para abrir el modo pantalla completa',
  //   'FaceTec_enter_fullscreen_action': 'Abrir Pantalla Completa',
  //   'FaceTec_initializing_camera': 'Iniciando cámara...',
  //   'FaceTec_initializing_camera_still_loading': 'Encriptación de la transmisión de la cámara...',
  //   'FaceTec_idscan_type_selection_header': 'Ten a la mano tu cedula original para este<br>paso<br><br>Preparate para tomar foto a tu cedula',
  //   'FaceTec_action_continue': 'Tomar foto de cédula',
  //   'FaceTec_idscan_capture_id_front_instruction_message': 'Cara delantera de tu cédula',
  //   'FaceTec_idscan_capture_tap_to_focus_message': 'Encaja tu cédula',
  //   'FaceTec_action_take_photo': 'Tomar foto cédula',
  //   'FaceTec_idscan_review_id_front_instruction_message': 'Confirma que la foto de tu cédula no está borrosa',
  //   'FaceTec_action_select_id_card': 'Foto de Identificación',
  //   'FaceTec_action_select_passport': 'Pasaporte',
  //   'FaceTec_idscan_capture_id_back_instruction_message': 'Cara trasera de tu cédula',
  //   'FaceTec_idscan_review_id_back_instruction_message': 'Confirma que la foto de tu cédula no está borrosa',
  //   'FaceTec_idscan_capture_passport_instruction_message': 'Página de muestra del pasaporte',
  //   'FaceTec_idscan_review_passport_instruction_message': 'Confirma que la foto de tu cédula no está borrosa',
  //   'FaceTec_action_accept_photo': 'Continuar',
  //   'FaceTec_action_retake_photo': 'Reintentar',
  //   'FaceTec_idscan_ocr_confirmation_main_header': 'Confirma tus datos',
  //   'FaceTec_action_confirm': 'Confirmar información',
  //   'FaceTec_result_idscan_success_user_confirmation_message': 'La carga de tu foto se completó con éxito',
  //   'FaceTec_result_idscan_unsuccess_message': 'la foto de tu cédula<br/>No se ve bien<br>Debes intentar otra vez',
  //   'FaceTec_result_success_message': 'Muy bien! Te hemos reconocido',
  //   'FaceTec_presession_hold_steady3': 'Reconociendo: 3',
  //   'FaceTec_presession_hold_steady2': 'Reconociendo: 2',
  //   'FaceTec_presession_hold_steady1': 'Reconociendo: 1',
  //   'FaceTec_presession_look_straight_ahead': 'Mira hacia adelante',
  //   'FaceTec_presession_frame_your_face': 'Enmarca tu rostro en el óvalo',
  //   'FaceTec_presession_remove_dark_glasses': 'Quitar gafas oscuras',
  //   'FaceTec_presession_neutral_expression': 'Expresion Neutral, sin sonreir',
  //   'FaceTec_presession_conditions_too_bright': 'Condiciones demasiados brillantes',
  //   'FaceTec_presession_brighten_your_environment': 'Ilumina tu entorno',
  //   'FaceTec_idscan_review_id_card_front_instruction_message': 'Confirma que la foto de tu cédula no está borrosa',
  //   'FaceTec_idscan_review_id_card_back_instruction_message': 'Confirma que la foto de tu cédula no está borrosa'
  //
  // };

  // Wait for onload to be complete before attempting to access the Browser SDK.
  window.onload = function() {

    // Set a the directory path for other FaceTec Browser SDK Resources.
    FaceTecSDK.setResourceDirectory('/assets/facetec/core-sdk/FaceTecSDK.js/resources');

    // Set the directory path for required FaceTec Browser SDK images.
    FaceTecSDK.setImagesDirectory('/assets/facetec/core-sdk/FaceTec_images');

    // const customConfiguration = new FaceTecSDK.FaceTecCustomization;
    // customConfiguration.vocalGuidanceCustomization.mode = 2;
    //
    //
    // /* ovalo de la camara */
    // customConfiguration.ovalCustomization.strokeColor = '#13a438';
    // customConfiguration.ovalCustomization.strokeWidth = 1;
    // customConfiguration.ovalCustomization.progressColor1 = '#13a438';
    // customConfiguration.ovalCustomization.progressColor2 = '#13a438';
    //
    //
    // /* Botones y textos */
    // customConfiguration.guidanceCustomization.foregroundColor = '#000000';
    // customConfiguration.guidanceCustomization.buttonBackgroundNormalColor = '#13a438';
    // customConfiguration.guidanceCustomization.retryScreenImageBorderColor = '#13a438';
    // customConfiguration.guidanceCustomization.retryScreenOvalStrokeColor = '#13a438';
    // customConfiguration.guidanceCustomization.readyScreenHeaderTextColor = '#13a438';
    // customConfiguration.guidanceCustomization.retryScreenSubtextTextColor = '#000000';
    // customConfiguration.guidanceCustomization.buttonBackgroundHighlightColor = '#13a438';
    // customConfiguration.guidanceCustomization.buttonBackgroundDisabledColor = '#13a438';
    // customConfiguration.guidanceCustomization.cameraPermissionsScreenImage = '../../../assets/images/icono-camara.svg';
    //
    //
    // /* borde de la pantalla interna */
    // customConfiguration.frameCustomization.borderColor = '#b4c3b4';
    // customConfiguration.frameCustomization.borderWidth = '1px';
    //
    // const activityIndicatorSVG: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // activityIndicatorSVG.setAttribute('viewBox', '0 0 255 280');
    // activityIndicatorSVG.classList.add('loader_crezcamos');
    // activityIndicatorSVG.innerHTML = " <path class=\"tronco\" d=\"M229.13,265.74q4.73,2.08,9.23,4.29a1.09,1.09,0,0,1,.25,1.53,1.1,1.1,0,0,1-1.08.45,365.44,365.44,0,0,0-104.37-14.18A383.18,383.18,0,0,0,30.21,272a1,1,0,0,1-.92-1.06.93.93,0,0,1,.21-.54l6.2-2.8c5.5-2.2,11-4.23,16.48-6L58,259.43,69.43,256c11.32-3.07,21.59-5.49,29.06-6.81a251.31,251.31,0,0,1,2.91-54.93c6.1-37.91,20.11-59.77,28.46-70.32,2.69-3.4,4.83-1.76,3.68,1.21-1.87,6.21-9.28,24-4.89,36.42a7.25,7.25,0,0,0,9.14,4.65A7.06,7.06,0,0,0,140,165a100.53,100.53,0,0,1,11-5.49c2.36-.71,4.72,1.37,3.68,2.25l-.93.83a28.63,28.63,0,0,0-7,9.5v1.54c-.52,1.39-1,2.54-1.32,3.46l-.88,2.42s-13.24,37.08,10.33,65.92a393.59,393.59,0,0,1,41.31,9l11.37,3.46,6.15,1.87c5.49,1.81,11,3.85,16.15,6\"/>\n" +
    //     "        <path class=\"hojas\" d=\"M69,21.07a48.84,48.84,0,0,0,3,16.48A67.16,67.16,0,0,0,87.89,62.32,66,66,0,0,0,100,71.88h0a1,1,0,0,1,0,1.37h0c-2.2,1.1-4.39,2.26-6.48,3.57a69.92,69.92,0,0,0-6,4.34A71.19,71.19,0,0,0,82,86.22l-.82.88a70.08,70.08,0,0,0-4.84,5.49l-.93,1.32a3.76,3.76,0,0,1-.6.82,1.08,1.08,0,0,1-1.1,0l-2-1.15A67.21,67.21,0,0,1,50.1,72.48a65.06,65.06,0,0,1-7.26-15.16A52.64,52.64,0,0,1,40.37,45.4v.22a1.35,1.35,0,0,0,0-.49v0a11,11,0,0,1,3.08-8.07,108.82,108.82,0,0,1,14.39-11,67.19,67.19,0,0,1,9.67-5.49,1,1,0,0,1,1.35.36.94.94,0,0,1,.13.46\"/>\n" +
    //     "        <path class=\"hojas\" d=\"M11.75,84.51A48.88,48.88,0,0,0,24.66,95.17a66.92,66.92,0,0,0,28.07,8.74,65.92,65.92,0,0,0,15.44-.44h.27a1,1,0,0,1,.83,1.15h0a60.08,60.08,0,0,0-2.64,6.87,64.8,64.8,0,0,0-1.87,7.25,69.52,69.52,0,0,0-1,7.47v10.22a3.62,3.62,0,0,1,0,1,.87.87,0,0,1-.71.77l-2.26.44a66.71,66.71,0,0,1-30.16-2.31,63,63,0,0,1-15.38-6.59,50.88,50.88,0,0,1-9.5-7.69H5.38l-.33-.33h0a10.5,10.5,0,0,1-2.47-8.13A114.24,114.24,0,0,1,6.64,95.45c1.1-3.63,2.31-7.2,3.68-10.66a1,1,0,0,1,1.27-.59,1,1,0,0,1,.44.31\"/>\n" +
    //     "        <path class=\"hojas\" d=\"M8.62,169.94a51,51,0,0,0,16.81,0,66.89,66.89,0,0,0,27.08-11.37,66.41,66.41,0,0,0,11.54-10.22h.27a.93.93,0,0,1,1.29.32l0,.06h0a68.17,68.17,0,0,0,2.36,7,57.46,57.46,0,0,0,3.25,6.7,64.55,64.55,0,0,0,4,6.43l.71.93a60.94,60.94,0,0,0,4.78,5.5,10.85,10.85,0,0,0,1.1,1.15,5.19,5.19,0,0,1,.71.77,1,1,0,0,1,0,1.1l-1.48,1.76a66.69,66.69,0,0,1-24.56,17.63,63.91,63.91,0,0,1-16.15,4.56,50.74,50.74,0,0,1-12.19.33h-1.1A10.42,10.42,0,0,1,20,197.9a109.62,109.62,0,0,1-8.4-16.21,111.2,111.2,0,0,1-4-10.49A.93.93,0,0,1,8.1,170a.84.84,0,0,1,.52-.05\"/>\n" +
    //     "        <path class=\"hojas\" d=\"M153.65,9.31a48.54,48.54,0,0,0-8.3,14.56,68.22,68.22,0,0,0-.6,44.33.42.42,0,0,1,0,.27,1,1,0,0,1-1,1h0A66.35,66.35,0,0,0,136.51,68a67.66,67.66,0,0,0-7.64-.87,71.12,71.12,0,0,0-7.58.27h-1.15a65,65,0,0,0-7.36,1.26l-1.54.39a3.08,3.08,0,0,1-1,0,.92.92,0,0,1-.87-.61c-.28-.66-.55-1.37-.77-2.08a67.42,67.42,0,0,1-3-29.5,63.24,63.24,0,0,1,4.12-16.48,51.54,51.54,0,0,1,5.83-10.72l.27-.38.28-.38h0a10.48,10.48,0,0,1,7.63-3.85,105.35,105.35,0,0,1,18.19.77c3.73.44,7.47,1,11,1.76a1,1,0,0,1,.75,1.18.93.93,0,0,1-.2.41\"/>\n" +
    //     "        <path class=\"hojas\" d=\"M186,21.07a48.35,48.35,0,0,1-3,16.48,66.62,66.62,0,0,1-15.87,24.72A64.35,64.35,0,0,1,155,71.88h0a1,1,0,0,0,0,1.43h0c2.19,1.1,4.39,2.25,6.48,3.57a65.87,65.87,0,0,1,6,4.34,70.92,70.92,0,0,1,5.49,5l.83.88a70.1,70.1,0,0,1,4.83,5.5l.94,1.26a2.13,2.13,0,0,0,.6.82,1,1,0,0,0,1.1,0l2-1.15A67,67,0,0,0,204.9,72.43a63.71,63.71,0,0,0,7.25-15.11,52.64,52.64,0,0,0,2.47-11.92v.17a1.62,1.62,0,0,1,0-.44v0a11,11,0,0,0-3.4-7.85,109.48,109.48,0,0,0-14.39-11c-3.14-2.09-6.38-4-9.67-5.82a1,1,0,0,0-1.39.5,1,1,0,0,0-.1.38\"/>\n" +
    //     "        <path class=\"hojas\" d=\"M243.24,84.51a48.84,48.84,0,0,1-12.9,10.66,67,67,0,0,1-28.08,8.74,65.85,65.85,0,0,1-15.43-.44h0a1,1,0,0,0-.83,1.15h0a60.08,60.08,0,0,1,2.64,6.87,66,66,0,0,1,1.87,7.19,70.62,70.62,0,0,1,1,7.53v10.22a3.62,3.62,0,0,0,0,1,.94.94,0,0,0,.72.77l2.25.44a67.54,67.54,0,0,0,30.16-2.31A64.82,64.82,0,0,0,240,129.51a51.14,51.14,0,0,0,9.29-7.42l.33-.33.33-.38h0a10.56,10.56,0,0,0,2.47-8.19,114.36,114.36,0,0,0-3.9-17.74c-1.1-3.63-2.31-7.2-3.68-10.66a1,1,0,0,0-1.27-.59,1,1,0,0,0-.43.31\"/>\n" +
    //     "        <path class=\"hojas\" d=\"M246.38,169.88a49.42,49.42,0,0,1-16.81,0,66.85,66.85,0,0,1-27.09-11.37A64,64,0,0,1,191,148.24h0a.92.92,0,0,0-1.28.32l0,.06h0a65.83,65.83,0,0,1-2.36,7,59,59,0,0,1-3.24,6.7,68.46,68.46,0,0,1-4,6.43l-.72.93a67.48,67.48,0,0,1-4.78,5.5,10.85,10.85,0,0,1-1.1,1.15,2.38,2.38,0,0,0-.71.77,1,1,0,0,0,0,1.1l1.48,1.76a67.31,67.31,0,0,0,24.56,17.63,66.17,66.17,0,0,0,16.15,4.56,54,54,0,0,0,12.19,0h1.1a10.56,10.56,0,0,0,7.09-4.67,113.3,113.3,0,0,0,8.46-16.15c1.48-3.46,2.86-7,4-10.49a1,1,0,0,0-1-1.32\"/>";
    //
    //
    //
    // /* pantalla de carga inicial */
    // customConfiguration.initialLoadingAnimationCustomization.customAnimation = activityIndicatorSVG;
    // customConfiguration.initialLoadingAnimationCustomization.messageTextColor = '#ffffff';
    // customConfiguration.initialLoadingAnimationCustomization.animationRelativeScale = 10.0;
    //
    // /* boton cancelar */
    // customConfiguration.cancelButtonCustomization.customImage = '../../../assets/images/icono-cerrar.svg';
    // customConfiguration.cancelButtonCustomization.location = 2;
    //
    // /* mensajes de ayuda */
    // customConfiguration.feedbackCustomization.backgroundColor = '#13a438';
    //
    // /* Pantalla de carga */
    // customConfiguration.resultScreenCustomization.foregroundColor = '#000000';
    // customConfiguration.resultScreenCustomization.uploadProgressFillColor = '#13a438';
    // customConfiguration.resultScreenCustomization.activityIndicatorColor = '#13a438';
    // customConfiguration.resultScreenCustomization.resultAnimationBackgroundColor = '#13a438';
    // customConfiguration.resultScreenCustomization.resultAnimationForegroundColor = '#13a438';
    // customConfiguration.resultScreenCustomization.resultAnimationSuccessBackgroundImage = '../../../assets/images/icono-check-positivo.svg';
    // customConfiguration.resultScreenCustomization.resultAnimationUnsuccessBackgroundImage = '../../../assets/images/icono-check-negativo.svg';
    // customConfiguration.resultScreenCustomization.showUploadProgressBar = true;
    // customConfiguration.resultScreenCustomization.uploadProgressTrackColor = '#13a438';
    // customConfiguration.resultScreenCustomization.customActivityIndicatorAnimation = activityIndicatorSVG;
    // customConfiguration.resultScreenCustomization.animationRelativeScale = 1.0;
    //
    //
    // /* fondo de pantalla*/
    // customConfiguration.overlayCustomization.backgroundColor = '#72c889';
    // customConfiguration.overlayCustomization.brandingImage = '../../../assets/images/icono-arbol-crezcamos-blanco.svg';
    //
    // /*Frame*/
    // customConfiguration.frameCustomization.backgroundColor = '#ffffff';
    // customConfiguration.frameCustomization.borderColor = '#13a438';
    //
    // /*Frame captura foto cedula*/
    // customConfiguration.idScanCustomization.captureFrameStrokeColor = '#13a438';
    // customConfiguration.idScanCustomization.reviewScreenBackgroundColors = '#13a438';
    //
    //
    // /*configuraciones botones Foto Cédula*/
    //
    // customConfiguration.idScanCustomization.buttonBackgroundNormalColor = '#13a438';
    // customConfiguration.idScanCustomization.buttonBackgroundHighlightColor = '#13a438';
    // customConfiguration.idScanCustomization.buttonBackgroundDisabledColor = '#13a438';
    // customConfiguration.idScanCustomization.selectionScreenDocumentImage = '../../../assets/images/icono-cedula-mano.svg';
    // customConfiguration.idScanCustomization.selectionScreenForegroundColor = '#787d7b';
    // customConfiguration.idScanCustomization.reviewScreenForegroundColor = '#13a438';
    // customConfiguration.idScanCustomization.captureScreenTextBackgroundBorderWidth = "2px";
    // customConfiguration.idScanCustomization.captureScreenTextBackgroundCornerRadius = "5px";
    // customConfiguration.idScanCustomization.reviewScreenTextBackgroundBorderWidth = "2px";
    // customConfiguration.idScanCustomization.reviewScreenTextBackgroundBorderCornerRadius = "5px";
    // customConfiguration.idScanCustomization.captureFrameStrokeWidth = "2px";
    // customConfiguration.idScanCustomization.captureFrameCornerRadius = "12px";
    // customConfiguration.idScanCustomization.subtextFont = '14px';
    // customConfiguration.idScanCustomization.captureScreenTextBackgroundColor = '#13a438';
    //
    //
    //
    // /*confirmacion OCR*/
    // customConfiguration.ocrConfirmationCustomization.buttonBackgroundNormalColor = '#13a438';
    // customConfiguration.ocrConfirmationCustomization.buttonBackgroundHighlightColor = '#13a438';
    // customConfiguration.ocrConfirmationCustomization.buttonBackgroundDisabledColor = '#13a438';
    //
    // /*texto y secciones*/
    // customConfiguration.ocrConfirmationCustomization.mainHeaderTextColor = '#13a438';
    // customConfiguration.ocrConfirmationCustomization.mainHeaderDividerLineColor = '#13a438';
    // customConfiguration.ocrConfirmationCustomization.sectionHeaderTextColor = '#13a438';
    // customConfiguration.ocrConfirmationCustomization.inputFieldBorderColor = '#13a438';
    // customConfiguration.ocrConfirmationCustomization.inputFieldCornerRadius = '1px';
    //
    // /*loading*/
    // customConfiguration.enterFullScreenCustomization.buttonBackgroundDisabledColor = '#13a438';
    // customConfiguration.enterFullScreenCustomization.buttonBackgroundHighlightColor = '#13a438';
    // customConfiguration.enterFullScreenCustomization.buttonBackgroundNormalColor = '#13a438';
    // customConfiguration.enterFullScreenCustomization.borderColor = '#13a438';
    //
    //
    // FaceTecSDK.setCustomization( customConfiguration );


    // Initialize FaceTec Browser SDK and configure the UI features.
    FaceTecSDK.initializeInDevelopmentMode(Config.DeviceKeyIdentifier, Config.PublicFaceScanEncryptionKey,function(initializedSuccessfully: boolean) {
      if(initializedSuccessfully) {
        SampleAppUtilities.enableControlButtons();
      }
      SampleAppUtilities.displayStatus(FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(FaceTecSDK.getStatus()));
    });
    FaceTecSDK.getStatus()
    // Idioma SDK
    // FaceTecSDK.configureLocalization( faceteci18n );

    SampleAppUtilities.formatUIForDevice();
  };

  // Initiate a 3D Liveness Check.
  function onLivenessCheckPressed(notiInput: Subject<FaceTecNotificar>) {
    notificador = notiInput;
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    getSessionToken(function(sessionToken) {
      latestProcessor = new LivenessCheckProcessor(sessionToken as string, AngularSampleApp as any);
    });
  }

  // Initiate a 3D Liveness Check, then storing the 3D FaceMap in the Database, also known as "Enrollment".  A random enrollmentIdentifier is generated each time to guarantee uniqueness.
  function onEnrollUserPressed(notiInput: Subject<FaceTecNotificar>, uidTercero: string) {
    notificador = notiInput;
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();
    // Get a Session Token from the FaceTec SDK, then start the Enrollment.
    getSessionToken( function( sessionToken ) {
      latestEnrollmentIdentifier = uidTercero + SampleAppUtilities.generateUUId();
      latestProcessor = new EnrollmentProcessor( sessionToken, AngularSampleApp as any);
    } );
  }

  // Perform 3D to 3D Authentication against the Enrollment previously performed.
  function onAuthenticateUserPressed(notiInput: Subject<FaceTecNotificar>, uidTercero: string) {
    notificador = notiInput;
    // For demonstration purposes, verify that we have an enrollmentIdentifier to Authenticate against.
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();
    // Get a Session Token from the FaceTec SDK, then start the 3D to 3D Matching.
    getSessionToken( function( sessionToken ) {
      latestEnrollmentIdentifier = uidTercero;
      latestProcessor = new AuthenticateProcessor( sessionToken, AngularSampleApp as any);
    } );
  }

  // Initiate a Photo ID Match.
  function onPhotoIdMatchPressed(notiInput: Subject<FaceTecNotificar>, uidTercero: string) {
    notificador = notiInput;
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    getSessionToken(  function( sessionToken ) {
      latestEnrollmentIdentifier = uidTercero + SampleAppUtilities.generateUUId();
      latestProcessor = new PhotoIDMatchProcessor( sessionToken as string, AngularSampleApp as any );
    } );

  }

  // Show the final result and transition back into the main interface.
  function onComplete(latestSessionResultRta: any, latestIDScanResultRta: any, statusRta: any) {
    SampleAppUtilities.showMainUI();

    if(!latestProcessor.isSuccess()) {
      // Reset the enrollment identifier.
      latestEnrollmentIdentifier = '';

      // Show early exit message to screen.  If this occurs, please check logs.
      SampleAppUtilities.displayStatus('Session exited early, see logs for more details.');
      notificador.next({estado: false, mensaje: FacetecMensajesCustom[FaceTecSDK.FaceTecSessionStatus[latestProcessor.latestSessionResult.status]]});

      return;
    }

    // Show successful message to screen
    SampleAppUtilities.displayStatus('Success');
    notificador.next({estado: true, mensaje: latestProcessor});
  }

  // Get the Session Token from the server
  function getSessionToken(sessionTokenCallback: (sessionToken?: string)=>void) {
    const XHR = new XMLHttpRequest();
    XHR.open('GET', Config.BaseURL + '/session-token');
    XHR.setRequestHeader('X-Device-Key', Config.DeviceKeyIdentifier);
    XHR.setRequestHeader('X-User-Agent', FaceTecSDK.createFaceTecAPIUserAgentString(''));
    XHR.onreadystatechange = function() {
      if(this.readyState === XMLHttpRequest.DONE) {
        let sessionToken = '';
        try {
          // Attempt to get the sessionToken from the response object.
          sessionToken = JSON.parse(this.responseText).sessionToken;
          // Something went wrong in parsing the response. Return an error.
          if(typeof sessionToken !== 'string') {
            onServerSessionTokenError();
            return;
          }
        }
        catch {
          // Something went wrong in parsing the response. Return an error.
          onServerSessionTokenError();
          return;
        }
        sessionTokenCallback(sessionToken);
      }
    };

    XHR.onerror = function() {
      onServerSessionTokenError();
    };
    XHR.send();
  }

  function onServerSessionTokenError() {
    SampleAppUtilities.handleErrorGettingServerSessionToken();
  }

  function isLockedOut() {
    return FaceTecSDK.isLockedOut();
  }

  //
  // DEVELOPER NOTE:  This is a convenience function for demonstration purposes only so the Sample App can have access to the latest session results.
  // In your code, you may not even want or need to do this.
  //
  function setLatestSessionResult(sessionResult: FaceTecSessionResult) {
    latestSessionResult = sessionResult;
  }

  function setLatestIDScanResult(idScanResult: FaceTecIDScanResult) {
    latestIDScanResult = idScanResult;
  }

  function getLatestEnrollmentIdentifier() {
    return latestEnrollmentIdentifier;
  }

  function setLatestServerResult(responseJSON: any) {
  }

  function clearLatestEnrollmentIdentifier(responseJSON: any) {
    latestEnrollmentIdentifier = '';
  }

  function getStatusFaceTec(){
    return FaceTecSDK.getStatus();
  }

  function getStatusMessageFaceTec() {
    return FacetecMensajeInitCustom[FaceTecSDK.FaceTecSDKStatus[FaceTecSDK.getStatus()]];
  }

  return {
    onLivenessCheckPressed,
    onComplete,
    setLatestSessionResult,
    setLatestIDScanResult,
    getLatestEnrollmentIdentifier,
    setLatestServerResult,
    clearLatestEnrollmentIdentifier,
    onAuthenticateUserPressed,
    onEnrollUserPressed,
    onPhotoIdMatchPressed,
    isLockedOut,
    getStatusFaceTec,
    getStatusMessageFaceTec
  };

})();
