export const FETCH_MON_SUCCESS = 'FETCH_MON_SUCCESS';
export const FETCH_MON_SUCCESS_X = 'FETCH_MON_SUCCESS_X';
export const FETCH_MON_FAIL = 'FETCH_MON_FAIL';
export const FETCH_MON_FAIL_X = 'FETCH_MON_FAIL_X';
export const FETCH_BAN_SUCCESS = 'FETCH_BAN_SUCCESS';
export const FETCH_BAN_SUCCESS_X = 'FETCH_BAN_SUCCESS_X';
export const FETCH_BAN_FAIL= 'FETCH_BAN_FAIL';
export const FETCH_BAN_FAIL_X = 'FETCH_BAN_FAIL_X';
export const THEM_MON_VAO_GIO_HANG = 'THEM_MON_VAO_GIO_HANG';
export const THEM_MON_VAO_GIO_HANG_X = 'THEM_MON_VAO_GIO_HANG_X';
export const XOA_MON_KHOI_GIO_HANG = 'XOA_MON_KHOI_GIO_HANG';
export const XOA_MON_KHOI_GIO_HANG_X = 'XOA_MON_KHOI_GIO_HANG_X';
export const XOA_BAN_VA_HOA_DON_TRONG_LOCAL = 'XOA_BAN_VA_HOA_DON_TRONG_LOCAL';
export const XOA_BAN_VA_HOA_DON_TRONG_LOCAL_X = 'XOA_BAN_VA_HOA_DON_TRONG_LOCAL_X';
export const THAY_DOI_SO_LUONG_MON_TRONG_GIO_HANG = 'THAY_DOI_SO_LUONG_MON_TRONG_GIO_HANG';
export const THAY_DOI_SO_LUONG_MON_TRONG_GIO_HANG_X = 'THAY_DOI_SO_LUONG_MON_TRONG_GIO_HANG_X';
export const XOA_CAC_MON_TRONG_REDUCER = 'XOA_CAC_MON_TRONG_REDUCER';
export const XOA_CAC_MON_TRONG_REDUCER_X = 'XOA_CAC_MON_TRONG_REDUCER_X';
export function xoa_ban_va_hoa_don_trong_local() {
  return {
    type: XOA_BAN_VA_HOA_DON_TRONG_LOCAL,
  }
}

export function fetch_mon_success() {
    return {
      type: FETCH_MON_SUCCESS,
      
    }
}

export function fetch_ban_success(ban) {
  return {
    type: FETCH_BAN_SUCCESS,
    payload: ban
  }
}
export function them_mon_vao_gio_hang(mon_moi) {
  return {
    type: THEM_MON_VAO_GIO_HANG,
    payload: mon_moi
  }
}
export function thay_doi_so_luong_mon_trong_gio_hang(mon) {
  return {
    type: THAY_DOI_SO_LUONG_MON_TRONG_GIO_HANG,
    payload: mon
  }
}
export function xoa_mon_khoi_gio_hang(mon_duoc_chon) {
  return {
    type: XOA_MON_KHOI_GIO_HANG,
    payload: mon_duoc_chon
  }
}