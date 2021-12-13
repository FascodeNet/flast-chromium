!macro customInstall
  WriteRegStr SHCTX "SOFTWARE\RegisteredApplications" "Flast" "Software\Clients\StartMenuInternet\Flast\Capabilities"

  WriteRegStr SHCTX "SOFTWARE\Classes\Flast" "" "Flast HTML Document"
  WriteRegStr SHCTX "SOFTWARE\Classes\Flast\Application" "AppUserModelId" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Classes\Flast\Application" "ApplicationIcon" "$INSTDIR\Flast.exe,0"
  WriteRegStr SHCTX "SOFTWARE\Classes\Flast\Application" "ApplicationName" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Classes\Flast\Application" "ApplicationCompany" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Classes\Flast\Application" "ApplicationDescription" "Cross-platform browser based on Chromium."
  WriteRegStr SHCTX "SOFTWARE\Classes\Flast\DefaultIcon" "DefaultIcon" "$INSTDIR\Flast.exe,0"
  WriteRegStr SHCTX "SOFTWARE\Classes\Flast\shell\open\command" "" '"$INSTDIR\Flast.exe" "%1"'

  WriteRegStr SHCTX "SOFTWARE\Classes\.htm\OpenWithProgIds" "Flast" ""
  WriteRegStr SHCTX "SOFTWARE\Classes\.html\OpenWithProgIds" "Flast" ""

  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast" "" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\DefaultIcon" "" "$INSTDIR\Flast.exe,0"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\Capabilities" "ApplicationDescription" "Cross-platform browser based on Chromium."
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\Capabilities" "ApplicationName" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\Capabilities" "ApplicationIcon" "$INSTDIR\Flast.exe,0"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\Capabilities\FileAssociations" ".htm" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\Capabilities\FileAssociations" ".html" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\Capabilities\FileAssociations" ".php" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\Capabilities\URLAssociations" "http" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\Capabilities\URLAssociations" "https" "Flast"
  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\Capabilities\StartMenu" "StartMenuInternet" "Flast"

  WriteRegDWORD SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\InstallInfo" "IconsVisible" 1

  WriteRegStr SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast\shell\open\command" "" "$INSTDIR\Flast.exe"
!macroend
!macro customUnInstall
  DeleteRegKey SHCTX "SOFTWARE\Classes\Flast"
  DeleteRegKey SHCTX "SOFTWARE\Clients\StartMenuInternet\Flast"
  DeleteRegValue SHCTX "SOFTWARE\RegisteredApplications" "Flast"
!macroend
