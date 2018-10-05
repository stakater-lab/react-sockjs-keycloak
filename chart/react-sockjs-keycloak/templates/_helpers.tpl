{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "react-sockjs-keycloak" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "react-sockjs-keycloak.labels.selector" -}}
app: {{ template "react-sockjs-keycloak.name" . }}
group: {{ .Values.labels.group }}
provider: {{ .Values.labels.provider }}
{{- end -}}

{{- define "react-sockjs-keycloak.labels.stakater" -}}
{{ template "react-sockjs-keycloak.labels.selector" . }}
version: "{{ .Values.labels.version }}"
{{- end -}}

{{- define "react-sockjs-keycloak.labels.chart" -}}
chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
release: {{ .Release.Name | quote }}
heritage: {{ .Release.Service | quote }}
{{- end -}}
