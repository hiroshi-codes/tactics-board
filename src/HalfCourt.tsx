import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { MdAdd, MdDelete, MdFileUpload, MdPlayArrow, MdRemove, MdSave } from "react-icons/md";

import appLogo from "/pwa-64x64.png";
import basketballSvg from "/basketball.svg";
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

interface Position {
  x: number;
  y: number;
  color: string;
}

const size = 40 as const;
const canvasSize = {
  width: screen.width < 480 ? screen.width : 480,
  height: screen.width < 480 ? 550 : 700,
} as const;

const firstPosition = {
  x: size / 2 + 40,
  y: screen.width < 480 ? 480 : 600,
};
const images: {
  [key: string]: HTMLImageElement;
} = {
  ball: await loadImage(basketballSvg),
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
} = {
  ball: {
    color: "orange",
    x: firstPosition.x + (size + 10) * 5,
    y: firstPosition.y,
  },
};
for (let index = 1; index <= 5; index++) {
  const addX = (size + 10) * (index - 1);
  initialPosition[`red${index}`] = {
    color: "red",
    x: firstPosition.x + addX,
    y: firstPosition.y,
  };

  initialPosition[`blue${index}`] = {
    color: "blue",
    x: firstPosition.x + addX,
    y: firstPosition.y + size + 10,
  };
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
  const canvasRef = React.useRef<HTMLCanvasElement>(null); //canvas要素取得
  const [render, setRender] = React.useState(false);
  const [drug, setDrug] = React.useState(false); //マウスドラック状態の管理
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

    //赤色の四角形を描画
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
      const target = newPosition.current[targetKey.current];
      newPosition.current = {
        ...newPosition.current,
        [targetKey.current]: {
          ...target,
          x: e.changedTouches[0].clientX - rect.left,
          y: e.changedTouches[0].clientY - rect.top,
        },
      };
      setRender(!render);
    }
  };
  const add = () => {
    positions.current.push(newPosition.current);
    setRender(!render);
    enqueueSnackbar(`${positions.current.length - 1}フレーム目、登録しました`, { autoHideDuration: 1000 });
  };

  const remove = () => {
    if (positions.current.length === 1) {
      return;
    }
    positions.current.pop();
    newPosition.current = positions.current.slice(-1)[0];

    setRender(!render);
    enqueueSnackbar(`${positions.current.length}フレーム目、削除しました`, { autoHideDuration: 1000 });
  };

  const play = () => {
    const position: {
      [key: string]: Position;
    } = JSON.parse(JSON.stringify(positions.current[1]));
    if (!position) {
      return;
    }
    let loop = 0;
    const render = (index: number) => {
      if (!canvasRef.current) {
        throw new Error("canvas要素の取得に失敗しました");
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("context取得失敗");
      }
      const firstPosition = positions.current[index];
      const nextPosition = positions.current[index + 1];
      if (!nextPosition) {
        return;
      }

      //描画前に既に描画済みのものを消してリセット
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      let next = 0;
      for (const [key, value] of Object.entries(firstPosition)) {
        const nextValue = nextPosition[key];
        const diffX = (nextValue.x - value.x) / 100;
        const diffY = (nextValue.y - value.y) / 100;
        if (loop > 0) {
          position[key].x += diffX;
          position[key].y += diffY;
        }
        if ((diffX >= 0 && nextValue.x <= position[key].x) || (diffX <= 0 && nextValue.x >= position[key].x)) {
          next += 1;
          ctx.drawImage(images[key], nextValue.x - size / 2, nextValue.y - size / 2, size, size);
        } else {
          ctx.fillStyle = position[key].color;
          ctx.drawImage(images[key], position[key].x - size / 2, position[key].y - size / 2, size, size);
        }
      }
      ctx.font = "24px serif";
      ctx.fillStyle = "white";
      ctx.fillText(`${String(index)} → ${String(index + 1)}`, 20, 40);

      loop += 1;
      if (Object.keys(firstPosition).length === next) {
        // 次の場所
        requestAnimationFrame(() => render(index + 1));
      } else {
        requestAnimationFrame(() => render(index));
      }
    };
    render(1);
  };

  const clear = () => {
    positions.current = [initialPosition];
    newPosition.current = initialPosition;
    setRender(!render);
  };

  const download = () => {
    const fileName = `tactics-board_${format(new Date(), "yyyyMMddhhmmss")}.json`;
    jsonFileExport(positions.current, fileName);
  };

  const inputClick = () => {
    inputRef.current?.click();
  };

  const upload: React.ChangeEventHandler<HTMLInputElement> | undefined = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const result = await jsonFileImport(file);
    if (result.success) {
      positions.current = result.data;
      newPosition.current = positions.current.slice(-1)[0];
      setRender(!render);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div>
          <div className="flex justify-between items-center px-4 pt-2">
            <div>
              <button
                type="button"
                className="ml-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={add}
              >
                <MdAdd size="25" />
              </button>
              <button
                type="button"
                className="ml-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={remove}
              >
                <MdRemove size="25" />
              </button>
              <button
                type="button"
                className="ml-6 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={play}
              >
                <MdPlayArrow size="25" />
              </button>
              <button
                type="button"
                className="ml-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={clear}
              >
                <MdDelete size="25" />
              </button>
            </div>
            <div>
              <button
                type="button"
                className="text-white bg-lime-700 hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center me-2 dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
                onClick={download}
              >
                <MdSave size="20" />
              </button>
              <button
                type="button"
                className="ml-2 text-white bg-lime-700 hover:bg-lime-800 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center me-2 dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
                onClick={inputClick}
              >
                <MdFileUpload size="20" />
                <input type="file" accept=".json" onChange={upload} className="hidden" ref={inputRef} />
              </button>
              <Link to="/" className="inline-block ml-2">
                <img src={appLogo} alt="tactics-board logo" width="30" height="30" />
              </Link>
            </div>
          </div>
          <div className="mt-8 mr-4 text-right text-white">{positions.current.length - 1} フレーム</div>
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onPointerDown={StartMove}
            onMouseMove={Move}
            onTouchMove={TouchMove}
            onMouseUp={EndMove}
            onTouchEnd={EndMove}
            className={`bg-[url(${import.meta.env.BASE_URL}half-court.png)] bg-contain bg-no-repeat`}
          />
        </div>
      </div>
    </>
  );
}

export default HalfCourt;
