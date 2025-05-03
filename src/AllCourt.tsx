import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { MdAdd, MdDelete, MdFiberManualRecord, MdFileUpload, MdHelp, MdPlayArrow, MdRemove, MdSave } from "react-icons/md";

import appLogo from "/pwa-64x64.png";
import basketballSvg from "/basketball.svg";
import halfCourtPng from "/all-court.png";
import red1Svg from "/red1.svg";
import red2Svg from "/red2.svg";
import red3Svg from "/red3.svg";
import red4Svg from "/red4.svg";
import red5Svg from "/red5.svg";
import blue1Svg from "/blue1.svg";
import blue2Svg from "/blue2.svg";
import blue3Svg from "/blue3.svg";
import blue4Svg from "/blue4.svg";
import blue5Svg from "/blue5.svg";

import Help from "./Help";
import IconButton from "./IconButton";

interface Position {
  x: number;
  y: number;
}

const size = 40 as const;
const canvasSize = {
  width: window.innerWidth < 480 ? window.innerWidth : 480,
  height: window.innerWidth < 480 ? 550 : window.innerHeight - 90,
} as const;

const firstPosition = {
  x: size / 2 + 5,
  y: size / 2 + 10,
};
const images: {
  [key: string]: HTMLImageElement;
} = {
  ball: await loadImage(basketballSvg),
  halfCourt: await loadImage(halfCourtPng),
  red1: await loadImage(red1Svg),
  red2: await loadImage(red2Svg),
  red3: await loadImage(red3Svg),
  red4: await loadImage(red4Svg),
  red5: await loadImage(red5Svg),
  blue1: await loadImage(blue1Svg),
  blue2: await loadImage(blue2Svg),
  blue3: await loadImage(blue3Svg),
  blue4: await loadImage(blue4Svg),
  blue5: await loadImage(blue5Svg),
};
const initialPosition: {
  [key: string]: Position;
} = {};
for (let index = 1; index <= 11; index++) {
  const add = (size + 5) * (index - 1);
  if (index <= 5) {
    initialPosition[`red${index}`] = {
      x: firstPosition.x,
      y: firstPosition.y + add,
    };
  } else if (index === 6) {
    initialPosition[`ball`] = {
      x: firstPosition.x,
      y: firstPosition.y + add,
    };
  } else {
    initialPosition[`blue${index - 6}`] = {
      x: firstPosition.x,
      y: firstPosition.y + add,
    };
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

async function jsonFileExport(exportJson: object, fileName = "download.json") {
  const data = new Blob([JSON.stringify(exportJson)], { type: "text/json" });
  const jsonURL = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = jsonURL;
  link.setAttribute("download", fileName);
  link.click();
  document.body.removeChild(link);
}

function jsonFileImport(file: File): Promise<{
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null;
}> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const json = JSON.parse(content);

      try {
        resolve({
          success: true,
          message: "インポートしました",
          data: json,
        });
      } catch (error) {
        console.error("JSONファイルを解析できませんでした。", error);
        resolve({
          success: false,
          message: "JSONファイルを解析できませんでした。",
          data: null,
        });
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
}

function HalfCourt() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [render, setRender] = React.useState(false);
  const [drug, setDrug] = React.useState(false);
  const [help, setHelp] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const targetKey = React.useRef("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const newPosition = React.useRef<{ [key: string]: Position }>(initialPosition);
  const positions = React.useRef<{ [key: string]: Position }[]>([initialPosition]);

  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error("canvas要素の取得に失敗しました");
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("context取得失敗");
    }

    //描画前に既に描画済みのものを消してリセット
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(images["halfCourt"], 0, 0, ctx.canvas.width, ctx.canvas.height);
    if (newPosition.current) {
      for (const [key, value] of Object.entries(newPosition.current)) {
        ctx.drawImage(images[key], value.x - size / 2, value.y - size / 2, size, size);
      }
    }
  }, [render, drug]);

  const StartMove: React.PointerEventHandler<HTMLCanvasElement> = (e) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const hit = Object.entries(newPosition.current).some(([key, value]) => {
      const check =
        value.x <= point.x + size / 2 &&
        point.x <= value.x + size / 2 && // 横方向の判定
        value.y <= point.y + size / 2 &&
        point.y <= value.y + size / 2; // 縦方向の判定
      if (check) {
        targetKey.current = key;
      }
      return check;
    });
    if (hit) {
      setDrug(true);
    }
  };

  const EndMove = () => {
    setDrug(false);
  };

  const Move: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    //変数drugがtrueの場合座標を更新する
    if (drug && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect(); //キャンバスの位置取得
      const target = newPosition.current[targetKey.current];
      newPosition.current = {
        ...newPosition.current,
        [targetKey.current]: {
          ...target,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
      };
      setRender(!render);
    }
  };
  const TouchMove: React.TouchEventHandler<HTMLCanvasElement> = (e) => {
    e.stopPropagation();
    //変数drugがtrueの場合座標を更新する
    if (drug && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect(); //キャンバスの位置取得
      let x = e.changedTouches[0].clientX - rect.left;
      let y = e.changedTouches[0].clientY - rect.top;
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > canvasSize.width) x = canvasSize.width;
      if (y > canvasSize.height) y = canvasSize.height;
      const target = newPosition.current[targetKey.current];
      newPosition.current = {
        ...newPosition.current,
        [targetKey.current]: {
          ...target,
          x,
          y,
        },
      };
      setRender(!render);
    }
  };
  const add = () => {
    if (JSON.stringify(positions.current.slice(-1)[0]) === JSON.stringify(newPosition.current)) {
      return;
    }
    positions.current.push(newPosition.current);
    setRender(!render);
    enqueueSnackbar(`${positions.current.length - 1}フレーム目、登録しました`);
  };

  const remove = () => {
    if (positions.current.length === 1) {
      return;
    }
    positions.current.pop();
    newPosition.current = positions.current.slice(-1)[0];

    setRender(!render);
    enqueueSnackbar(`${positions.current.length}フレーム目、削除しました`);
  };

  const play = async () => {
    if (playing) {
      return false;
    }
    if (!positions.current[2]) {
      return false;
    }
    const position: {
      [key: string]: Position;
    } = JSON.parse(JSON.stringify(positions.current[1]));
    if (!position) {
      return false;
    }
    setPlaying(true);
    return new Promise<boolean>((resolve, reject) => {
      let loop = 0;
      const render = (index: number) => {
        if (!canvasRef.current) {
          reject("canvas要素の取得に失敗しました");
          setPlaying(false);
          return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject("context取得失敗");
          setPlaying(false);
          return;
        }
        const firstPosition = positions.current[index];
        const nextPosition = positions.current[index + 1];
        if (!nextPosition) {
          ctx.fillText("END", 130, 40);
          resolve(true);
          setPlaying(false);
          return;
        }

        //描画前に既に描画済みのものを消してリセット
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#f3b75f";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(images["halfCourt"], 0, 0, ctx.canvas.width, ctx.canvas.height);
        for (const [key, value] of Object.entries(firstPosition)) {
          const nextValue = nextPosition[key];
          const diffX = (nextValue.x - value.x) / 100;
          const diffY = (nextValue.y - value.y) / 100;
          if (loop > 0) {
            position[key].x += diffX;
            position[key].y += diffY;
          }
          if ((diffX >= 0 && nextValue.x <= position[key].x) || (diffX <= 0 && nextValue.x >= position[key].x)) {
            ctx.drawImage(images[key], nextValue.x - size / 2, nextValue.y - size / 2, size, size);
          } else {
            ctx.drawImage(images[key], position[key].x - size / 2, position[key].y - size / 2, size, size);
          }
        }
        ctx.font = "24px serif";
        ctx.fillStyle = "white";
        ctx.fillText(`${String(index)} → ${String(index + 1)}`, 50, 40);

        loop += 1;
        if (loop % 100 === 0) {
          // 次の場所
          requestAnimationFrame(() => render(index + 1));
        } else {
          requestAnimationFrame(() => render(index));
        }
      };
      render(1);
    });
  };

  const recording = async () => {
    if (!positions.current[1]) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const stream = canvas.captureStream();
    const recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
    //ダウンロード用のリンクを準備
    //録画終了時に動画ファイルのダウンロードリンクを生成する処理
    recorder.ondataavailable = function (e) {
      const fileName = `tactics-board_${format(new Date(), "yyyyMMddhhmmss")}.mp4`;

      const data = new Blob([e.data], { type: e.data.type });
      const jsonURL = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = jsonURL;
      link.setAttribute("download", fileName);
      link.click();
      document.body.removeChild(link);
    };
    //録画開始
    setTimeout(() => {
      setPlaying(true);
    }, 1);
    recorder.start();
    await play();
    recorder.stop();
    setPlaying(false);
  };

  const clear = () => {
    positions.current = [initialPosition];
    newPosition.current = initialPosition;
    setRender(!render);
  };

  const download = async () => {
    if (positions.current.length === 1) {
      return;
    }
    const fileName = `tactics-board_${format(new Date(), "yyyyMMddhhmmss")}.json`;
    await jsonFileExport(positions.current, fileName);
    enqueueSnackbar(`${fileName}、保存しました`);
  };

  const inputClick = () => {
    inputRef.current?.click();
  };

  const upload: React.ChangeEventHandler<HTMLInputElement> | undefined = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      e.target.value = "";
      return;
    }

    const file = e.target.files[0];
    const result = await jsonFileImport(file);
    if (result.success) {
      positions.current = result.data;
      newPosition.current = positions.current.slice(-1)[0];
      setRender(!render);
      enqueueSnackbar(`${file.name}、読み込みました`);
    }
    e.target.value = "";
  };

  return (
    <>
      <Help show={help} onClose={() => setHelp(false)} />
      <div className="flex justify-center">
        <div>
          <div className="flex justify-between items-center p-2">
            <Link to="/" className="flex items-center">
              <img src={appLogo} alt="tactics-board logo" width="35" height="35" />
              tactics board
            </Link>
            <Link to="/half-court">HALF</Link>
            <div>
              <IconButton Icon={MdHelp} color="lime" buttonProps={{ onClick: () => setHelp(true), disabled: playing }} />
              <IconButton Icon={MdSave} color="lime" buttonProps={{ onClick: download, disabled: playing }} className="ml-2" />
              <IconButton Icon={MdFileUpload} color="lime" buttonProps={{ onClick: inputClick, disabled: playing }} className="ml-2">
                <input type="file" accept=".json" onChange={upload} className="hidden" ref={inputRef} />
              </IconButton>
            </div>
          </div>
          <div className="flex justify-between items-center px-2">
            <div>
              <IconButton Icon={MdAdd} color="blue" size={25} buttonProps={{ onClick: add, disabled: playing }} />
              <IconButton Icon={MdRemove} color="red" size={25} buttonProps={{ onClick: remove, disabled: playing }} className="ml-4" />
              <IconButton Icon={MdPlayArrow} color="green" size={25} buttonProps={{ onClick: play, disabled: playing }} className="ml-4" />
              <IconButton Icon={MdFiberManualRecord} color="red" size={25} buttonProps={{ onClick: recording, disabled: playing }} className="ml-4" />
              <IconButton Icon={MdDelete} color="red" size={25} buttonProps={{ onClick: clear, disabled: playing }} className="ml-4" />
            </div>
            <div className="text-white">{positions.current.length - 1} フレーム</div>
          </div>
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onPointerDown={StartMove}
            onMouseMove={Move}
            onTouchMove={TouchMove}
            onMouseUp={EndMove}
            onTouchEnd={EndMove}
          />
        </div>
      </div>
    </>
  );
}

export default HalfCourt;
