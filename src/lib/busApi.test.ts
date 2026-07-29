import { getRequestErrorMessage, REQUEST_TIMEOUT_MESSAGE, toTimeoutError } from './busApi';

describe('toTimeoutError', () => {
  it('타임아웃 중단은 사용자용 Error로 바꾼다', () => {
    const mapped = toTimeoutError(new DOMException('timed out', 'TimeoutError'));

    expect(mapped).toBeInstanceOf(Error);
    expect(mapped?.message).toBe(REQUEST_TIMEOUT_MESSAGE);
  });

  it('호출부 취소(AbortError)는 null을 반환한다 (원본이 그대로 전파됨)', () => {
    expect(toTimeoutError(new DOMException('aborted', 'AbortError'))).toBeNull();
  });

  it('DOMException이 아닌 일반 에러도 null을 반환한다', () => {
    expect(toTimeoutError(new Error('network down'))).toBeNull();
  });
});

describe('getRequestErrorMessage', () => {
  // 검증 대상은 둘: (1) 서버 원문을 화면에 노출하지 않는다(passthrough 금지), (2) 이 함수의 유일한
  // 로직인 "코드→안내 버킷" 분류. 단 분류는 exact-copy가 아니라 '관계'로만 가드한다(문구 변경엔 안 깨지게).
  it('서버 원문 메시지를 화면에 그대로 노출하지 않는다(passthrough 제거)', () => {
    const message = getRequestErrorMessage({
      error: { code: 'BAD_REQUEST', message: 'stationId is invalid.' },
    });
    expect(message).toBeTruthy(); // 빈 값이 아니라 실제 안내가 나온다
    expect(message).not.toContain('stationId'); // 서버 내부 문구가 화면에 새지 않는다
  });

  it('코드→안내 버킷 분류: CONFIG·INTERNAL은 한 버킷으로 묶이고, 각 버킷은 default로 새지 않는다', () => {
    const config = getRequestErrorMessage({ error: { code: 'CONFIGURATION_ERROR' } });
    const internal = getRequestErrorMessage({ error: { code: 'INTERNAL_ERROR' } });
    const upstream = getRequestErrorMessage({ error: { code: 'UPSTREAM_ERROR' } });
    const fallback = getRequestErrorMessage({ error: { code: 'SOMETHING_UNKNOWN' } });

    expect(config).toBe(internal); //  같은 버킷 = 같은 안내 (문구 자체는 고정하지 않음)
    expect(config).not.toBe(fallback); //  CONFIG·INTERNAL이 default로 새지 않는다
    expect(upstream).not.toBe(fallback); // UPSTREAM도 default로 새지 않는다
  });

  it('payload가 null이어도 크래시 없이 안내 메시지를 반환한다', () => {
    expect(getRequestErrorMessage(null)).toBeTruthy();
  });
});
