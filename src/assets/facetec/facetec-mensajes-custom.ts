export enum FacetecMensajesCustom {
    CameraNotRunning = 'La camara no esta disponible.',
    CameraNotEnabled = 'La camara no esta activa.',
    SessionCompletedSuccessfully = 'La sesión se realizó con éxito y se generó un FaceScan. Pase el FaceScan al servidor para su procesamiento posterior.',
    MissingGuidanceImages = 'La sesión se canceló porque no se configuraron todas las imágenes de guía.',
    Timeout = 'La sesión se canceló porque el usuario no pudo completar una sesión en el tiempo asignado predeterminado o el tiempo de espera establecido por el desarrollador.',
    ContextSwitch = 'La sesión se canceló debido a que la aplicación se cerró, se puso en suspensión, una notificación del sistema operativo o la aplicación se colocó en segundo plano.',
    ProgrammaticallyCancelled = 'El desarrollador llamó mediante programación a la API de cancelación de sesión.',
    OrientationChangeDuringSession = 'La sesión se canceló debido a un cambio de orientación del dispositivo durante la sesión.',
    LandscapeModeNotAllowed = 'La sesión se canceló porque el dispositivo está en modo horizontal.',
    UserCancelled = 'El usuario presionó el botón cancelar y no completó la sesión.',
    UserCancelledFromNewUserGuidance = 'El usuario presionó el botón cancelar durante la Guía para nuevos usuarios.',
    UserCancelledFromRetryGuidance = 'El usuario presionó el botón cancelar durante la guía de reintento.',
    UserCancelledWhenAttemptingToGetCameraPermissions = 'El usuario canceló la experiencia del SDK del navegador FaceTec mientras intentaba obtener los permisos de la cámara.',
    LockedOut = 'La sesión se canceló porque el usuario estaba bloqueado.',
    NonProductionModeDeviceKeyIdentifierInvalid = 'Su clave no es válida o si ocurren problemas de conectividad de red durante una sesión',
    DocumentNotReady = 'La sesión se canceló porque el SDK del navegador FaceTec no se puede procesar cuando el documento no está listo.',
    SessionInProgress = 'La sesión se canceló porque había otra sesión en curso.',
    InitializationNotCompleted = 'La sesión se canceló porque la inicialización aún no se ha completado.',
    UnknownInternalError = 'La sesión se canceló debido a un error inesperado y desconocido.',
    UserCancelledViaClickableReadyScreenSubtext = 'La sesión se canceló porque el usuario presionó el mensaje de subtexto de la pantalla Estoy Listo.',
    NotAllowedUseIframeConstructor = 'La sesión se canceló, el SDK del navegador FaceTec se abrió en un Iframe sin un constructor de Iframe.',
    NotAllowedUseNonIframeConstructor = 'La sesión se canceló, el SDK del navegador FaceTec no se abrió en un Iframe con un constructor de Iframe.',
    IFrameNotAllowedWithoutPermission = 'La sesión se canceló, el SDK del navegador FaceTec no se abrió en un Iframe sin permiso.',
    StillLoadingResources = 'FaceTec SDK todavía está cargando recursos.',
    ResourcesCouldNotBeLoadedOnLastInit = 'FaceTec SDK no pudo cargar recursos.',
    UserCancelledFullScreenMode = 'La sesión se canceló porque se detectó un cambio de modo de pantalla completa en un IFrame'
}
export enum FacetecMensajeInitCustom {
    NeverInitialized = 'Nunca se intentó inicializar.',
    Initialized = 'La clave proporcionada fue verificada.',
    NetworkIssues = 'No se pudo verificar la clave debido a problemas de conectividad en el dispositivo del usuario.',
    InvalidDeviceKeyIdentifier = 'La clave proporcionada no es válida.',
    VersionDeprecated = 'Deprecado',
    DeviceNotSupported = 'Esta combinación de dispositivo / plataforma / navegador / versión no es compatible con FaceTec Browser SDK.',
    DeviceInLandscapeMode = 'El dispositivo está en orientación de pantalla horizontal. El SDK del navegador FaceTec solo se puede utilizar en orientación vertical.',
    DeviceLockedOut = 'El dispositivo está en modo de retrato inverso. El SDK del navegador FaceTec solo se puede utilizar en orientación vertical.',
    KeyExpiredOrInvalid = 'La clave venció, contenía texto no válido o está intentando inicializar en un dominio que no está especificado en su clave.',
    IFrameNotAllowedWithoutPermission = 'La sesión fue cancelada, el FaceTec Browser SDK se abrió en un IFrame sin permiso.',
    StillLoadingResources = 'FaceTec SDK todavía está cargando recursos.'
}