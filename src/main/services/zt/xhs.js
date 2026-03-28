/**
 * 查找小红书指定标题的笔记信息
 * @param {puppeteer.Page} page
 * @param {string} name 视频标题关键词
 * @returns {Promise<{title: string, status: boolean, url?: string} | null>}
 */
async function findXhsNoteInfo(page, name) {
  const noteSelector = ".content .note";

  try {
    await page.waitForSelector(noteSelector, { timeout: 15000 });
  } catch (error) {
    console.warn("小红书列表加载超时:", error?.message || error);
    return null;
  }

  const keyword = (name || "").replace(/\s+/g, "").trim();
  if (!keyword) return null;

  const maxScrollTimes = 6;

  for (let i = 0; i < maxScrollTimes; i++) {
    const result = await page.$$eval(
      noteSelector,
      (items, key) => {
        const normalize = text => (text || "").replace(/\s+/g, "").trim();

        for (const item of items) {
          const titleText = normalize(item.querySelector(".title")?.textContent || "");
          if (!titleText || !titleText.includes(key)) continue;

          const allText = normalize(item.textContent || "");
          const actionTexts = Array.from(item.querySelectorAll(".icon_list .icon span"))
            .map(el => normalize(el.textContent))
            .filter(Boolean);

          const hasDeleteAction = actionTexts.some(text => text.includes("删除"));
          const hasPublishedTime = allText.includes("发布于");
          const hasAuditError = /审核中|待审核|未通过|驳回|违规|失败/.test(allText);

          return {
            title: titleText,
            status: hasDeleteAction || (hasPublishedTime && !hasAuditError),
          };
        }

        return null;
      },
      keyword
    );

    if (result) return result;

    const noContent = await page.$eval(".no-content", el => {
      const style = window.getComputedStyle(el);
      return style.display !== "none";
    }).catch(() => false);

    if (noContent) break;

    await page.evaluate(() => {
      window.scrollBy(0, Math.max(window.innerHeight, 800));
    });
    await page.waitForTimeout(1000);
  }

  return null;
}

export default async function (page, data, window, event) {
  console.log("获取审核状态 小红书", data);
  await page.waitForTimeout(1000 * 5);

  const result = await findXhsNoteInfo(page, data.bt);
  if (result) {
    console.log("找到小红书笔记:", result);
    event.reply("puppeteerFile-done", {
      taskId: data.taskId,
      ...result,
    });
  } else {
    event.reply("puppeteerFile-done", {
      taskId: data.taskId,
      status: false,
    });
    console.log("未找到指定笔记");
  }

  window.close();
}
