import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Svg,
  Path,
  Rect,
  Circle,
  G,
  Font
} from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

/* -------------------------------------------------------------------------- */
/* Brand tokens                                                               */
/* -------------------------------------------------------------------------- */
const BRAND = {
  purple: '#302645',
  green: '#95B541',
  grey: '#676767',
  ink: '#221F1F',
  softgrey: '#F1F4F4',
  white: '#FFFFFF'
};

/* -------------------------------------------------------------------------- */
/* Fonts                                                                      */
/* -------------------------------------------------------------------------- */
try {
  Font.register({
    family: 'Poppins',
    fonts: [
      { src: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-400-normal.ttf', fontWeight: 400 },
      { src: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-500-normal.ttf', fontWeight: 500 },
      { src: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-600-normal.ttf', fontWeight: 600 },
      { src: 'https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-700-normal.ttf', fontWeight: 700 }
    ]
  });
} catch (_) {
  /* HMR re-registration noop */
}

// react-pdf-tailwind v3 doesn't reliably resolve custom theme.fontFamily /
// extended colors, so we keep tw() for layout/spacing utilities only and
// apply fontFamily + colors via inline style.
const tw = createTw({});
const POPPINS = { fontFamily: 'Poppins' };

/* -------------------------------------------------------------------------- */
/* Cover background pattern                                                   */
/* -------------------------------------------------------------------------- */
function CoverPattern() {
  const W = 612;
  const H = 792;
  const bars = [];
  let seed = 1;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 70; i++) {
    const x = rand() * W * 1.2 - 80;
    const y = rand() * H * 1.2 - 80;
    const len = 80 + rand() * 220;
    const thick = 14 + rand() * 8;
    bars.push({ x, y, len, thick });
  }
  return (
    <Svg style={{ position: 'absolute', top: 0, left: 0 }} width={W} height={H}>
      <Rect x={0} y={0} width={W} height={H} fill={BRAND.purple} />
      <G transform={`rotate(-35 ${W / 2} ${H / 2})`}>
        {bars.map((b, i) => (
          <Rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.len}
            height={b.thick}
            rx={b.thick / 2}
            ry={b.thick / 2}
            fill="#FFFFFF"
            fillOpacity={0.045}
          />
        ))}
      </G>
    </Svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Intellezy logo — green circle + white lightbulb mark                       */
/* -------------------------------------------------------------------------- */
function BulbLogo({ size = 96 }) {
  // Bulb mark native viewBox: 23 wide x 38 tall.
  // Scale so the mark height fills ~52% of the circle, then center it.
  const markH = size * 0.52;
  const scale = markH / 38;
  const markW = 23 * scale;
  const tx = (size - markW) / 2;
  const ty = (size - markH) / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={BRAND.green} />
      <G transform={`translate(${tx} ${ty}) scale(${scale})`}>
        <Path d="M15.1911 35.0297H7.704C6.88828 35.0297 6.22461 35.6933 6.22461 36.5089C6.22461 37.3245 6.88828 37.9883 7.704 37.9883H15.1911C16.0069 37.9883 16.6704 37.3245 16.6704 36.5089C16.6704 35.6933 16.0069 35.0297 15.1911 35.0297Z" fill="#FFFFFF" />
        <Path d="M16.8968 30.5915H5.84267C5.02695 30.5915 4.36328 31.2551 4.36328 32.0708C4.36328 32.8863 5.02695 33.5498 5.84267 33.5498H16.8968C17.7125 33.5498 18.3759 32.8863 18.3759 32.0708C18.3759 31.2551 17.7125 30.5915 16.8968 30.5915Z" fill="#FFFFFF" />
        <Path d="M20.7852 5.28276C19.526 3.35411 16.6645 0.103685 11.6498 0.00336647C11.3416 -0.00521469 11.0261 0.00530052 11.0236 0.00542068C5.99693 0.132935 3.14753 3.36656 1.89645 5.28276C0.342845 7.66248 -0.260756 10.7929 0.102445 14.5873C0.371371 17.3958 1.14442 20.509 2.46621 24.106L2.5148 24.2322C3.11296 25.8421 3.83972 26.9965 4.73679 27.7615C5.65923 28.5482 6.76708 28.9307 8.12332 28.9307C9.6125 28.9307 10.781 28.4178 11.5965 27.4064C12.3897 26.4226 12.8139 25.0112 12.8571 23.2108C12.8575 23.2079 12.8576 23.2048 12.8579 23.2018L12.8632 23.013V18.2544C12.8632 17.4387 12.1995 16.775 11.3839 16.775H11.3613C10.5457 16.775 9.88215 17.4387 9.88215 18.2544V23.0433C9.88215 24.9732 9.26114 25.9517 8.03653 25.9517C7.22202 25.9517 6.41561 25.7783 5.50791 23.6878C2.5455 15.9951 2.17843 10.3564 4.41649 6.92834C5.37254 5.46346 7.53712 3.00602 11.2911 3.00602L11.3621 3.00614C15.1388 3.00614 17.3076 5.46261 18.2644 6.92689C22.0985 12.7968 17.3252 23.6441 15.7702 26.8301C15.664 27.0605 15.6575 27.1802 15.6595 27.3359L15.6599 27.3872C15.6599 28.2184 16.3362 28.8946 17.1674 28.8946C17.7128 28.8946 18.2679 28.5266 18.445 28.1813C20.6635 23.6167 25.3326 12.248 20.7852 5.28276Z" fill="#FFFFFF" />
        <Path d="M11.3592 10.4477C9.97978 10.4477 8.85742 11.5699 8.85742 12.9494C8.85742 14.3288 9.97978 15.4512 11.3592 15.4512C12.7387 15.4512 13.861 14.3288 13.861 12.9494C13.861 11.5699 12.7387 10.4477 11.3592 10.4477Z" fill="#FFFFFF" />
      </G>
    </Svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable building blocks                                                   */
/* -------------------------------------------------------------------------- */
function SoftBox({ title, children }) {
  return (
    <View style={[tw('rounded-md px-5 py-4 mb-3'), { backgroundColor: BRAND.softgrey }]}>
      <Text style={[POPPINS, { color: BRAND.ink, fontSize: 11, fontWeight: 700, marginBottom: 6 }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Bullet({ children }) {
  return (
    <View style={tw('flex flex-row mb-1.5 pr-2')}>
      <Text style={[POPPINS, { color: BRAND.green, fontSize: 10, marginRight: 6 }]}>•</Text>
      <Text style={[tw('flex-1'), POPPINS, { color: BRAND.grey, fontSize: 9.5, lineHeight: 1.45 }]}>
        {children}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Cover page                                                                 */
/* -------------------------------------------------------------------------- */
function CoverPage({ data }) {
  return (
    <Page size="LETTER" style={tw('relative')}>
      <CoverPattern />
      <View style={tw('absolute left-[0.95in] top-[4.6in]')}>
        <BulbLogo size={96} />
      </View>
      <View style={tw('absolute left-[0.95in] top-[6.4in] right-[0.75in]')}>
        <Text style={[POPPINS, { color: BRAND.white, fontSize: 40, fontWeight: 700, letterSpacing: -1 }]}>
          {data.candidate_name || ''}
        </Text>
        <Text style={[POPPINS, { color: BRAND.white, fontSize: 16, fontWeight: 400, marginTop: 12 }]}>
          {data.job_title || ''}
        </Text>
        {data.location ? (
          <Text style={[POPPINS, { color: BRAND.white, fontSize: 10, fontWeight: 400, marginTop: 6, opacity: 0.8 }]}>
            {data.location}
          </Text>
        ) : null}
      </View>
      <Text
        style={[
          tw('absolute bottom-4 left-0 right-0 text-center'),
          POPPINS,
          { color: BRAND.white, opacity: 0.6, fontSize: 8 }
        ]}
      >
        1
      </Text>
    </Page>
  );
}

/* -------------------------------------------------------------------------- */
/* Content page(s)                                                            */
/* -------------------------------------------------------------------------- */
function ContentPages({ data }) {
  const hasEducation = (data.education || []).length > 0;
  const hasSpecialties = !!data.specialties_skills?.text;
  const hasTechnical = !!data.technical_skills?.text;
  const hasCerts = (data.certifications?.items || []).length > 0;

  return (
    <Page
      size="LETTER"
      style={[tw('px-[0.75in] pt-[0.65in] pb-[0.6in] bg-white'), POPPINS]}
    >
      {hasEducation && (
        <SoftBox title="Education">
          {data.education.map((e, i) => (
            <Text key={i} style={[POPPINS, { color: BRAND.grey, fontSize: 9.5, lineHeight: 1.45 }]}>
              {[e.institution, e.degree].filter(Boolean).join(' ')}
            </Text>
          ))}
        </SoftBox>
      )}

      {(hasSpecialties || hasTechnical) && (
        <SoftBox title="Specialties + Skills">
          {hasSpecialties && (
            <View style={tw('flex flex-row mb-1')}>
              <Text style={[POPPINS, { color: BRAND.ink, fontSize: 10, marginRight: 6 }]}>•</Text>
              <Text style={[tw('flex-1'), POPPINS, { color: BRAND.grey, fontSize: 9.5, lineHeight: 1.45 }]}>
                {data.specialties_skills.text}
              </Text>
            </View>
          )}
          {hasTechnical && (
            <View style={tw('flex flex-row')}>
              <Text style={[POPPINS, { color: BRAND.ink, fontSize: 10, marginRight: 6 }]}>•</Text>
              <Text style={[tw('flex-1'), POPPINS, { color: BRAND.grey, fontSize: 9.5, lineHeight: 1.45 }]}>
                {data.technical_skills.text}
              </Text>
            </View>
          )}
        </SoftBox>
      )}

      {hasCerts && (
        <SoftBox title="Certifications">
          {data.certifications.items.map((c, i) => (
            <View key={i} style={tw('flex flex-row mb-1')}>
              <Text style={[POPPINS, { color: BRAND.ink, fontSize: 10, marginRight: 6 }]}>•</Text>
              <Text style={[tw('flex-1'), POPPINS, { color: BRAND.grey, fontSize: 9.5, lineHeight: 1.45 }]}>
                {c}
              </Text>
            </View>
          ))}
        </SoftBox>
      )}

      <Text style={[tw('mt-3 mb-2'), POPPINS, { color: BRAND.ink, fontSize: 20, fontWeight: 700 }]}>
        Select Experiences
      </Text>

      {(data.experiences || []).map((exp, i) => (
        <View key={i} style={tw('mb-4')} wrap={false}>
          <Text style={[POPPINS, { color: BRAND.ink, fontSize: 10.5, fontWeight: 700 }]}>
            {exp.job_title || ''}
          </Text>
          <Text style={[POPPINS, { color: BRAND.grey, fontSize: 9, marginTop: 2, marginBottom: 6 }]}>
            {[exp.company, exp.location, exp.date_range].filter(Boolean).join(' | ')}
          </Text>
          {exp.paragraph ? (
            <Text style={[POPPINS, { color: BRAND.grey, fontSize: 9.5, lineHeight: 1.45, marginBottom: 4 }]}>
              {exp.paragraph}
            </Text>
          ) : null}
          {(exp.bullets || []).map((b, j) => (
            <Bullet key={j}>{b}</Bullet>
          ))}
        </View>
      ))}

      <Text
        style={[
          tw('absolute bottom-4 left-0 right-0 text-center'),
          POPPINS,
          { color: BRAND.grey, fontSize: 8 }
        ]}
        render={({ pageNumber }) => `${pageNumber}`}
        fixed
      />
    </Page>
  );
}

/* -------------------------------------------------------------------------- */
/* Document                                                                   */
/* -------------------------------------------------------------------------- */
export default function ResumePdf({ data }) {
  const safe = data || {};
  return (
    <Document
      title={`${safe.candidate_name || 'Resume'} — ${safe.job_title || ''}`}
      author={safe.candidate_name || ''}
    >
      <CoverPage data={safe} />
      <ContentPages data={safe} />
    </Document>
  );
}
