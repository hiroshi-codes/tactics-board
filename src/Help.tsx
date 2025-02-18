import { ReactNode } from "react";

import { MdAdd, MdDelete, MdFiberManualRecord, MdFileUpload, MdPlayArrow, MdRemove, MdSave } from "react-icons/md";

import IconButton from "./IconButton";

import appLogo from "/pwa-64x64.png";
import basketballSvg from "/basketball.svg";
import red1Svg from "/red1.svg";
import blue1Svg from "/blue1.svg";

function Description({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center mt-2">
      <div className="w-12">{icon}</div>
      <div className="text-sm text-white">{children}</div>
    </div>
  );
}

function Help({ show, onClose }: { show: boolean; onClose: React.MouseEventHandler<HTMLButtonElement> | undefined }) {
  return (
    <div className={`relative z-10 ${show ? "" : "hidden"}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500/80 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className=" px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mt-3 text-center sm:mt-0">
                <h3 className="text-base font-semibold text-white" id="modal-title">
                  操作説明
                </h3>
                <Description icon={<img src={appLogo} alt="tactics-board logo" width="35" height="35" />}>TOP画面にもどります</Description>
                <Description icon={<IconButton Icon={MdAdd} color="blue" />}>現在の表示を登録します</Description>
                <Description icon={<IconButton Icon={MdRemove} color="red" />}>現在の表示を削除してひとつ前を表示します</Description>
                <Description icon={<IconButton Icon={MdPlayArrow} color="green" />}>登録した順番にアニメーションします</Description>
                <Description icon={<IconButton Icon={MdFiberManualRecord} color="red" />}>アニメーションを動画に変換して保存します</Description>
                <Description icon={<IconButton Icon={MdDelete} color="red" />}>初期状態に戻します</Description>
                <Description icon={<IconButton Icon={MdSave} color="lime" />}>Jsonファイルで保存します</Description>
                <Description icon={<IconButton Icon={MdFileUpload} color="lime" />}>Jsonファイルを読み込んで反映します</Description>
                <Description
                  icon={
                    <>
                      <img src={basketballSvg} alt="tactics-board ball" width="30" height="30" className="ml-1" />
                      <img src={red1Svg} alt="tactics-board ball" width="30" height="30" className="ml-1" />
                      <img src={blue1Svg} alt="tactics-board ball" width="30" height="30" className="ml-1" />
                    </>
                  }
                >
                  好きな場所に配置してください
                </Description>
              </div>
            </div>
            <div className="px-4 py-3 sm:flex sm:justify-center sm:px-6">
              <button
                type="button"
                className="bg-white mt-3 inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
